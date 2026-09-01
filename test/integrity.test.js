import { test, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
    DefensiveUtils,
    DeliveryFeeEngine,
    CouponEngine,
    CartOrderCalculator,
    OrderMessageBuilder,
    EscPosReceiptBuilder
} from '../engines.js';

describe('ETAPA 4: Testes de Integridade & Motores de Negócio (Don Food)', () => {

    describe('1. DefensiveUtils (Validações e Sanitizações)', () => {
        it('deve retornar array seguro contra nulos e indefinidos', () => {
            assert.deepEqual(DefensiveUtils.safeArray(null), []);
            assert.deepEqual(DefensiveUtils.safeArray(undefined), []);
            assert.deepEqual(DefensiveUtils.safeArray([1, 2, 3]), [1, 2, 3]);
            assert.deepEqual(DefensiveUtils.safeArray('invalid', ['default']), ['default']);
        });

        it('deve formatar valores monetários em Real (R$) com precisão', () => {
            assert.equal(DefensiveUtils.formatCurrency(0), 'R$ 0,00');
            assert.equal(DefensiveUtils.formatCurrency(24.5), 'R$ 24,50');
            assert.equal(DefensiveUtils.formatCurrency('39.99'), 'R$ 39,99');
            assert.equal(DefensiveUtils.formatCurrency(null), 'R$ 0,00');
        });

        it('deve escapar caracteres especiais HTML para prevenir XSS', () => {
            const raw = '<script>alert("XSS")</script>&"\'';
            const escaped = DefensiveUtils.escapeHtml(raw);
            assert.equal(escaped.includes('<script>'), false);
            assert.equal(escaped.includes('&lt;script&gt;'), true);
        });

        it('deve sanitizar números de telefone apenas com dígitos', () => {
            assert.equal(DefensiveUtils.sanitizePhone('(21) 99999-8888'), '21999998888');
            assert.equal(DefensiveUtils.sanitizePhone('+55 21 98888-7777'), '5521988887777');
        });
    });

    describe('2. DeliveryFeeEngine (Cálculo de Frete e Bairros)', () => {
        const mockNeighborhoods = [
            { id: 'centro-1', name: 'Centro', zone: 'centro', zoneName: 'Centro', fee: 3.50, time: '20 - 30 min' },
            { id: 'zs-copa', name: 'Copacabana', zone: 'zona_sul', zoneName: 'Zona Sul', fee: 7.00, time: '35 - 50 min' },
            { id: 'zn-tijuca', name: 'Tijuca', zone: 'zona_norte', zoneName: 'Zona Norte', fee: 8.50, time: '40 - 55 min' }
        ];

        it('deve calcular taxa correta para bairro cadastrado', () => {
            const res = DeliveryFeeEngine.calculateDeliveryFee({
                selectedNeighborhoodId: 'zs-copa',
                neighborhoodsList: mockNeighborhoods
            });

            assert.equal(res.fee, 7.00);
            assert.equal(res.time, '35 - 50 min');
            assert.equal(res.neighborhoodName, 'Copacabana');
            assert.equal(res.neighborhoodZone, 'zona_sul');
        });

        it('deve processar bairro digitado manualmente (tipo other)', () => {
            const res = DeliveryFeeEngine.calculateDeliveryFee({
                selectedNeighborhoodId: 'other',
                customNeighborhoodName: 'Bairro Especial',
                defaultFee: 6.00
            });

            assert.equal(res.fee, 6.00);
            assert.equal(res.neighborhoodName, 'Bairro Especial');
            assert.equal(res.neighborhoodZone, 'outra');
        });

        it('deve usar fallback padrão se bairro não for selecionado', () => {
            const res = DeliveryFeeEngine.calculateDeliveryFee({
                selectedNeighborhoodId: null,
                neighborhoodsList: mockNeighborhoods,
                defaultFee: 5.00,
                defaultTime: '30 - 45 min'
            });

            assert.equal(res.fee, 5.00);
            assert.equal(res.time, '30 - 45 min');
        });
    });

    describe('3. CouponEngine (Validação e Cálculo de Cupons)', () => {
        const mockCoupons = [
            { code: 'PRIMEIRACOMPRA', discount: 10, active: true, description: '10% OFF na 1ª compra' },
            { code: 'DON15', discount: 15, active: true, description: '15% OFF Don Food' },
            { code: 'PAUSADO', discount: 20, active: false, description: 'Cupom pausado' }
        ];

        it('deve calcular desconto percentual corretamente para cupom ativo', () => {
            const res = CouponEngine.validateAndCalculateCoupon({
                couponCode: 'DON15',
                subtotal: 100.00,
                availableCoupons: mockCoupons
            });

            assert.equal(res.isValid, true);
            assert.equal(res.code, 'DON15');
            assert.equal(res.discount, 15);
            assert.equal(res.discountValue, 15.00);
            assert.equal(res.error, null);
        });

        it('deve rejeitar cupom inativo', () => {
            const res = CouponEngine.validateAndCalculateCoupon({
                couponCode: 'PAUSADO',
                subtotal: 50.00,
                availableCoupons: mockCoupons
            });

            assert.equal(res.isValid, false);
            assert.equal(res.discountValue, 0);
            assert.ok(res.error.includes('inativo'));
        });

        it('deve rejeitar cupom inexistente', () => {
            const res = CouponEngine.validateAndCalculateCoupon({
                couponCode: 'INVALIDO99',
                subtotal: 80.00,
                availableCoupons: mockCoupons
            });

            assert.equal(res.isValid, false);
            assert.equal(res.discountValue, 0);
            assert.ok(res.error.includes('não encontrado'));
        });
    });

    describe('4. CartOrderCalculator (Cálculo Financeiro do Pedido)', () => {
        const sampleCart = [
            { name: 'Açaí 500ml', price: 22.00, quantity: 2, details: 'Banana, Leite Ninho, Granola' },
            { name: 'Água Mineral', price: 5.00, quantity: 1, details: '' }
        ];

        it('deve calcular subtotal e total de itens com precisão', () => {
            const subtotal = CartOrderCalculator.calculateSubtotal(sampleCart);
            const totalItems = CartOrderCalculator.countTotalItems(sampleCart);

            assert.equal(subtotal, 49.00); // 22*2 + 5*1
            assert.equal(totalItems, 3);
        });

        it('deve calcular o resumo financeiro completo com cupom e taxa de entrega', () => {
            const availableCoupons = [{ code: 'DESC10', discount: 10, active: true }];
            const breakdown = CartOrderCalculator.calculateFullOrderBreakdown({
                cart: sampleCart,
                appliedCoupon: { code: 'DESC10' },
                deliveryInfo: { fee: 6.00, time: '30 - 45 min' },
                availableCoupons
            });

            assert.equal(breakdown.subtotal, 49.00);
            assert.equal(breakdown.couponInfo.isValid, true);
            assert.equal(breakdown.discountValue, 4.90); // 10% de 49.00
            assert.equal(breakdown.deliveryFee, 6.00);
            assert.equal(breakdown.finalTotal, 50.10); // 49.00 - 4.90 + 6.00
        });
    });

    describe('5. OrderMessageBuilder & WhatsApp Format', () => {
        const orderData = {
            id: '#9988',
            cart: [
                { name: 'Barca Especial Açaí', price: 35.00, quantity: 1, details: 'Morango, Nutella, Paçoca, Leite Condensado' }
            ],
            customerData: {
                name: 'Mariana Silva',
                phone: '21988887777',
                address: 'Av. Atlântica, 1500 - Apto 302',
                neighborhood: 'Copacabana',
                neighborhoodZone: 'Zona Sul',
                reference: 'Em frente ao posto 4'
            },
            paymentMethodLabel: 'Pix',
            deliveryInfo: { fee: 5.00, time: '25 - 40 min', neighborhoodName: 'Copacabana', neighborhoodZoneName: 'Zona Sul' },
            company: { id: 'comp-1', name: 'Açaí da Praia', whatsappNumber: '5521999990000' }
        };

        it('deve construir registro de pedido consistente', () => {
            const order = OrderMessageBuilder.buildOrderRecord({
                orderId: orderData.id,
                cart: orderData.cart,
                customerData: orderData.customerData,
                paymentMethodLabel: orderData.paymentMethodLabel,
                deliveryInfo: orderData.deliveryInfo,
                company: orderData.company
            });

            assert.equal(order.id, '#9988');
            assert.equal(order.customerName, 'Mariana Silva');
            assert.equal(order.customerNeighborhood, 'Copacabana');
            assert.equal(order.subtotal, 35.00);
            assert.equal(order.deliveryFee, 5.00);
            assert.equal(order.total, 40.00);
            assert.equal(order.status, 'RECEIVED');
        });

        it('deve formatar texto de WhatsApp estruturado com emojis e quebras de linha', () => {
            const order = OrderMessageBuilder.buildOrderRecord({
                orderId: orderData.id,
                cart: orderData.cart,
                customerData: orderData.customerData,
                paymentMethodLabel: orderData.paymentMethodLabel,
                deliveryInfo: orderData.deliveryInfo,
                company: orderData.company
            });

            const waText = OrderMessageBuilder.formatWhatsAppMessage({
                order,
                restaurantName: 'Açaí da Praia'
            });

            assert.ok(waText.includes('Novo Pedido #9988'));
            assert.ok(waText.includes('Mariana Silva'));
            assert.ok(waText.includes('Copacabana (Zona Sul)'));
            assert.ok(waText.includes('Barca Especial Açaí'));
            assert.ok(waText.includes('Morango, Nutella'));
            assert.ok(waText.includes('TOTAL: R$ 40,00'));
        });
    });

    describe('6. EscPosReceiptBuilder (Impressão Térmica 58mm / 80mm)', () => {
        const sampleOrder = {
            id: '#1234',
            date: '01/09/2026 14:30',
            customerName: 'Carlos Eduardo',
            customerPhone: '21977776666',
            customerNeighborhood: 'Centro',
            customerAddress: 'Rua da Quitanda, 50',
            paymentMethod: 'Cartão de Débito',
            deliveryTime: '20 - 30 min',
            items: [
                { name: 'Copo Açaí 400ml', quantity: 2, price: 18.00, details: 'Banana e Granola' }
            ],
            subtotal: 36.00,
            deliveryFee: 4.00,
            total: 40.00
        };

        it('deve gerar buffer de comandos binários ESC/POS para 58mm', () => {
            const uint8array = EscPosReceiptBuilder.generateCommands(sampleOrder, {
                paperWidth: 58,
                storeName: 'DON FOOD MATRIZ',
                storeAddress: 'Centro - RJ',
                storeInstagram: '@donfood'
            });

            assert.ok(uint8array instanceof Uint8Array);
            assert.ok(uint8array.length > 50);

            // Converter para texto e verificar integridade dos dados
            const decoded = new TextDecoder().decode(uint8array);
            assert.ok(decoded.includes('DON FOOD MATRIZ'));
            assert.ok(decoded.includes('#1234'));
            assert.ok(decoded.includes('Carlos Eduardo'));
            assert.ok(decoded.includes('Copo Açaí 400ml'));
            assert.ok(decoded.includes('TOTAL'));
        });

        it('deve adaptar largura de colunas para padrão 80mm', () => {
            const uint8array = EscPosReceiptBuilder.generateCommands(sampleOrder, {
                paperWidth: 80,
                storeName: 'DON FOOD 80MM'
            });

            const decoded = new TextDecoder().decode(uint8array);
            assert.ok(decoded.includes('COMPROVANTE DE PEDIDO 80MM'));
        });
    });

    describe('7. Fluxo Completo de Ponta a Ponta (E2E Simulation)', () => {
        it('deve executar com sucesso todo o ciclo de vida do pedido: Navegação ➔ Cardápio ➔ Carrinho ➔ WhatsApp ➔ Recepção no Painel ➔ Impressão', () => {
            // Passo 1: Seleção da Empresa / Loja
            const activeCompany = {
                id: 'company-demo-don',
                name: 'Don Food Açaí & Lanches',
                whatsappNumber: '5521980001111',
                settings: { deliveryFee: 5.00 }
            };
            assert.equal(activeCompany.id, 'company-demo-don');

            // Passo 2: Abertura do Cardápio e Adição de Produtos ao Carrinho
            const simulatedCart = [];
            
            // Item 1: Açaí Personalizado com Acompanhamentos
            const acaiProduct = {
                id: 101,
                name: 'Açaí Tradicional 500ml',
                price: 24.00,
                quantity: 1,
                details: 'Nutella, Morango Fresco, Leite em Pó, Granola Crocante'
            };
            simulatedCart.push(acaiProduct);

            // Item 2: Refrigerante
            const beverage = {
                id: 102,
                name: 'Guaraná Antarctica Lata',
                price: 6.00,
                quantity: 2,
                details: 'Gelado'
            };
            simulatedCart.push(beverage);

            assert.equal(simulatedCart.length, 2);
            const cartItemsCount = CartOrderCalculator.countTotalItems(simulatedCart);
            assert.equal(cartItemsCount, 3); // 1 açaí + 2 guaranás

            // Passo 3: Identificação do Cliente, Bairro de Entrega e Aplicação de Cupom
            const customer = {
                name: 'Juliana Mendes',
                phone: '21988882222',
                address: 'Rua Visconde de Pirajá, 300 - Apto 101',
                neighborhood: 'Ipanema',
                neighborhoodZone: 'Zona Sul',
                reference: 'Próximo à Praça General Osório'
            };

            const deliveryInfo = DeliveryFeeEngine.calculateDeliveryFee({
                selectedNeighborhoodId: 'ipanema',
                neighborhoodsList: [
                    { id: 'ipanema', name: 'Ipanema', zone: 'zona_sul', zoneName: 'Zona Sul', fee: 6.00, time: '25 - 40 min' }
                ]
            });

            assert.equal(deliveryInfo.fee, 6.00);

            const coupon = CouponEngine.validateAndCalculateCoupon({
                couponCode: 'DON10',
                subtotal: CartOrderCalculator.calculateSubtotal(simulatedCart),
                availableCoupons: [{ code: 'DON10', discount: 10, active: true }]
            });

            assert.equal(coupon.isValid, true);
            assert.equal(coupon.discountValue, 3.60); // 10% de 36.00 (24 + 12)

            // Passo 4: Finalização e Construção do Pedido + Mensagem para WhatsApp
            const finalOrder = OrderMessageBuilder.buildOrderRecord({
                cart: simulatedCart,
                customerData: customer,
                paymentMethodLabel: 'Pix (Chave no WhatsApp)',
                appliedCoupon: coupon,
                company: activeCompany,
                deliveryInfo,
                availableCoupons: [{ code: 'DON10', discount: 10, active: true }]
            });

            assert.ok(finalOrder.id.startsWith('#'));
            assert.equal(finalOrder.subtotal, 36.00);
            assert.equal(finalOrder.discountValue, 3.60);
            assert.equal(finalOrder.deliveryFee, 6.00);
            assert.equal(finalOrder.total, 38.40); // 36.00 - 3.60 + 6.00

            const whatsappMessage = OrderMessageBuilder.formatWhatsAppMessage({
                order: finalOrder,
                restaurantName: activeCompany.name
            });

            assert.ok(whatsappMessage.includes('Juliana Mendes'));
            assert.ok(whatsappMessage.includes('Ipanema'));
            assert.ok(whatsappMessage.includes('Açaí Tradicional 500ml'));
            assert.ok(whatsappMessage.includes('Nutella, Morango Fresco'));
            assert.ok(whatsappMessage.includes('Guaraná Antarctica'));
            assert.ok(whatsappMessage.includes('TOTAL: R$ 38,40'));

            // Passo 5: Recepção e Armazenamento no Painel da Empresa (Store / Memory)
            const companyOrdersStore = [];
            companyOrdersStore.unshift(finalOrder);

            assert.equal(companyOrdersStore.length, 1);
            assert.equal(companyOrdersStore[0].status, 'RECEIVED');

            // Passo 6: Progressão dos Status do Pedido no Painel Admin
            const validStatusTransitions = ['RECEIVED', 'PREPARING', 'DELIVERING', 'COMPLETED'];
            for (const nextStatus of validStatusTransitions) {
                companyOrdersStore[0].status = nextStatus;
                assert.equal(companyOrdersStore[0].status, nextStatus);
            }

            // Passo 7: Emissão do Comprovante de Impressão Térmica (ESC/POS 58mm)
            const printBuffer = EscPosReceiptBuilder.generateCommands(finalOrder, {
                paperWidth: 58,
                storeName: activeCompany.name,
                storeAddress: 'Ipanema - RJ'
            });

            assert.ok(printBuffer.length > 100);
            const printText = new TextDecoder().decode(printBuffer);
            assert.ok(printText.includes(finalOrder.id));
            assert.ok(printText.includes('Juliana Mendes'));
            assert.ok(printText.includes('TOTAL'));
        });
    });
});
