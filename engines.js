/**
 * DON FOOD - Pure Business Logic Engines & Defensive Utilities
 * Isomorphic module for calculating delivery fees, coupons, orders, WhatsApp messages, and ESC/POS receipts.
 */

export const DefensiveUtils = {
    safeArray(val, fallback = []) {
        return Array.isArray(val) ? val : fallback;
    },
    safeObject(val, fallback = {}) {
        return (val && typeof val === 'object' && !Array.isArray(val)) ? val : fallback;
    },
    safeString(val, maxLen = 0, fallback = '') {
        if (val === null || val === undefined) return fallback;
        const str = String(val).trim();
        return maxLen > 0 ? str.slice(0, maxLen) : str;
    },
    safeNumber(val, fallback = 0, min = null, max = null) {
        const parsed = typeof val === 'number' ? val : parseFloat(val);
        let num = isNaN(parsed) ? fallback : parsed;
        if (min !== null && num < min) num = min;
        if (max !== null && num > max) num = max;
        return num;
    },
    safeInteger(val, fallback = 0, min = null, max = null) {
        const parsed = typeof val === 'number' ? Math.floor(val) : parseInt(val, 10);
        let num = isNaN(parsed) ? fallback : parsed;
        if (min !== null && num < min) num = min;
        if (max !== null && num > max) num = max;
        return num;
    },
    formatCurrency(val) {
        const num = this.safeNumber(val, 0);
        return `R$ ${num.toFixed(2).replace('.', ',')}`;
    },
    escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },
    sanitizePhone(phone) {
        return this.safeString(phone).replace(/\D/g, '');
    }
};

export const DeliveryFeeEngine = {
    calculateDeliveryFee({
        selectedNeighborhoodId = null,
        customNeighborhoodName = '',
        neighborhoodsList = [],
        defaultFee = 5.00,
        defaultTime = '30 - 45 min',
        customerData = null
    } = {}) {
        const safeList = DefensiveUtils.safeArray(neighborhoodsList);
        const safeDefFee = DefensiveUtils.safeNumber(defaultFee, 5.00, 0);
        const safeDefTime = DefensiveUtils.safeString(defaultTime, 50, '30 - 45 min');

        let fee = safeDefFee;
        let time = safeDefTime;
        let neighborhoodName = '';
        let neighborhoodZone = '';
        let neighborhoodZoneName = '';
        let selectedId = selectedNeighborhoodId;

        if (selectedId === 'other') {
            neighborhoodName = DefensiveUtils.safeString(customNeighborhoodName) ||
                               (customerData && DefensiveUtils.safeString(customerData.neighborhood)) ||
                               'Outro Bairro';
            neighborhoodZone = 'outra';
            neighborhoodZoneName = 'Outra Região';
            return { fee, time, neighborhoodName, neighborhoodZone, neighborhoodZoneName, selectedId };
        }

        if (selectedId) {
            const found = safeList.find(n => n && (n.id === selectedId || (n.name && n.name.toLowerCase() === String(selectedId).toLowerCase())));
            if (found) {
                fee = DefensiveUtils.safeNumber(found.fee, safeDefFee, 0);
                time = DefensiveUtils.safeString(found.time, 50, safeDefTime);
                neighborhoodName = DefensiveUtils.safeString(found.name);
                neighborhoodZone = DefensiveUtils.safeString(found.zone);
                neighborhoodZoneName = DefensiveUtils.safeString(found.zoneName) ||
                    (found.zone === 'centro' ? 'Centro' :
                    (found.zone === 'zona_sul' ? 'Zona Sul' :
                    (found.zone === 'zona_norte' ? 'Zona Norte' : 'Outra Região')));
                return { fee, time, neighborhoodName, neighborhoodZone, neighborhoodZoneName, selectedId: found.id || selectedId };
            }
        }

        if (customerData && customerData.neighborhood) {
            const custName = DefensiveUtils.safeString(customerData.neighborhood);
            const custId = DefensiveUtils.safeString(customerData.neighborhoodId);
            const found = safeList.find(n => n && ((n.name && n.name.toLowerCase() === custName.toLowerCase()) || n.id === custId));
            if (found) {
                fee = DefensiveUtils.safeNumber(found.fee, safeDefFee, 0);
                time = DefensiveUtils.safeString(found.time, 50, safeDefTime);
                neighborhoodName = DefensiveUtils.safeString(found.name);
                neighborhoodZone = DefensiveUtils.safeString(found.zone);
                neighborhoodZoneName = DefensiveUtils.safeString(found.zoneName) || '';
                return { fee, time, neighborhoodName, neighborhoodZone, neighborhoodZoneName, selectedId: found.id || custId };
            }
            neighborhoodName = custName;
        }

        return { fee, time, neighborhoodName, neighborhoodZone, neighborhoodZoneName, selectedId };
    }
};

export const CouponEngine = {
    validateAndCalculateCoupon({
        couponCode = '',
        subtotal = 0,
        availableCoupons = []
    } = {}) {
        const safeSubtotal = DefensiveUtils.safeNumber(subtotal, 0, 0);
        const safeCode = DefensiveUtils.safeString(couponCode, 30).toUpperCase();
        const list = DefensiveUtils.safeArray(availableCoupons);

        if (!safeCode) {
            return { isValid: false, code: '', discount: 0, discountValue: 0, description: '', error: 'Informe o código do cupom.' };
        }

        const found = list.find(c => c && DefensiveUtils.safeString(c.code).toUpperCase() === safeCode);

        if (!found) {
            return { isValid: false, code: safeCode, discount: 0, discountValue: 0, description: '', error: `Cupom "${safeCode}" não encontrado.` };
        }

        if (found.active === false) {
            return { isValid: false, code: found.code, discount: 0, discountValue: 0, description: found.description || '', error: `O cupom "${found.code}" está inativo ou pausado.` };
        }

        const discountPercent = DefensiveUtils.safeNumber(found.discount, 0, 0, 100);
        const discountValue = (safeSubtotal * discountPercent) / 100;

        return {
            isValid: true,
            code: found.code,
            discount: discountPercent,
            discountValue: Math.min(safeSubtotal, discountValue),
            description: found.description || '',
            error: null
        };
    }
};

export const CartOrderCalculator = {
    calculateSubtotal(items = []) {
        const safeItems = DefensiveUtils.safeArray(items);
        return safeItems.reduce((sum, item) => {
            const price = DefensiveUtils.safeNumber(item ? item.price : 0, 0, 0);
            const qty = DefensiveUtils.safeInteger(item ? item.quantity : 1, 1, 1, 999);
            return sum + (price * qty);
        }, 0);
    },
    countTotalItems(items = []) {
        const safeItems = DefensiveUtils.safeArray(items);
        return safeItems.reduce((sum, item) => {
            return sum + DefensiveUtils.safeInteger(item ? item.quantity : 1, 1, 1, 999);
        }, 0);
    },
    calculateFullOrderBreakdown({
        cart = [],
        appliedCoupon = null,
        deliveryInfo = null,
        availableCoupons = []
    } = {}) {
        const safeCart = DefensiveUtils.safeArray(cart);
        const totalItems = this.countTotalItems(safeCart);
        const subtotal = this.calculateSubtotal(safeCart);

        let couponInfo = { isValid: false, code: null, discount: 0, discountValue: 0 };

        if (appliedCoupon && appliedCoupon.code) {
            const calc = CouponEngine.validateAndCalculateCoupon({
                couponCode: appliedCoupon.code,
                subtotal,
                availableCoupons
            });
            if (calc.isValid) couponInfo = calc;
        }

        const deliveryFee = deliveryInfo ? DefensiveUtils.safeNumber(deliveryInfo.fee, 0, 0) : 0;
        const deliveryTime = deliveryInfo ? DefensiveUtils.safeString(deliveryInfo.time, 50, '30 - 45 min') : '30 - 45 min';
        const finalTotal = Math.max(0, subtotal - couponInfo.discountValue + deliveryFee);

        return {
            totalItems,
            subtotal,
            couponInfo,
            discountValue: couponInfo.discountValue,
            deliveryFee,
            deliveryTime,
            finalTotal
        };
    }
};

export const OrderMessageBuilder = {
    buildOrderRecord({
        orderId = null,
        cart = [],
        customerData = {},
        paymentMethodLabel = 'Pix',
        cashChangeFor = '',
        appliedCoupon = null,
        company = {},
        settings = {},
        deliveryInfo = {},
        availableCoupons = [],
        isScheduled = false,
        scheduledDate = null,
        scheduledTime = null
    } = {}) {
        const breakdown = CartOrderCalculator.calculateFullOrderBreakdown({
            cart, appliedCoupon, deliveryInfo, availableCoupons
        });

        const generatedId = orderId || (
            '#' + Date.now().toString(36).slice(-6).toUpperCase() +
            Math.floor(Math.random() * 100).toString().padStart(2, '0')
        );

        const compId = DefensiveUtils.safeString(company.id || settings.activeCompanyId, 60, 'company-demo-don');
        const compName = DefensiveUtils.safeString(company.name || settings.restaurantName, 100, 'Don Food');
        const compWa = DefensiveUtils.safeString(company.whatsappNumber || settings.whatsappNumber, 30);

        const custObj = DefensiveUtils.safeObject(customerData);
        const safeItems = DefensiveUtils.safeArray(cart).map(item => ({
            name: DefensiveUtils.safeString(item.name, 120, 'Item'),
            details: DefensiveUtils.safeString(item.details, 500, ''),
            quantity: DefensiveUtils.safeInteger(item.quantity, 1, 1, 99),
            price: DefensiveUtils.safeNumber(item.price, 0, 0)
        }));

        const safeSched = isScheduled === true
            && DefensiveUtils.safeString(scheduledDate, 20)
            && DefensiveUtils.safeString(scheduledTime, 10);

        return {
            id: generatedId,
            companyId: compId,
            companyName: compName,
            companyWhatsapp: compWa,
            customerName: DefensiveUtils.safeString(custObj.name, 100, 'Cliente'),
            customerNeighborhood: DefensiveUtils.safeString(custObj.neighborhood || deliveryInfo.neighborhoodName, 100, 'Centro'),
            customerNeighborhoodZone: DefensiveUtils.safeString(custObj.neighborhoodZone || deliveryInfo.neighborhoodZoneName, 100, ''),
            customerAddress: DefensiveUtils.safeString(custObj.address, 200, ''),
            customerReference: DefensiveUtils.safeString(custObj.reference, 200, ''),
            customerPhone: DefensiveUtils.safeString(custObj.phone, 30, ''),
            paymentMethod: paymentMethodLabel,
            cashChangeFor: cashChangeFor ? DefensiveUtils.safeString(cashChangeFor, 50) : null,
            deliveryTime: breakdown.deliveryTime,
            date: new Date().toLocaleString('pt-BR'),
            couponCode: breakdown.couponInfo.isValid ? breakdown.couponInfo.code : null,
            couponDiscount: breakdown.couponInfo.isValid ? breakdown.couponInfo.discount : 0,
            discountValue: breakdown.discountValue,
            items: safeItems,
            subtotal: breakdown.subtotal,
            deliveryFee: breakdown.deliveryFee,
            total: breakdown.finalTotal,
            status: 'RECEIVED',
            isScheduled: !!safeSched,
            scheduledDate: safeSched ? DefensiveUtils.safeString(scheduledDate, 20) : null,
            scheduledTime: safeSched ? DefensiveUtils.safeString(scheduledTime, 10) : null,
            orderType: safeSched ? 'SCHEDULED' : 'IMMEDIATE',
            created_at: new Date().toISOString()
        };
    },

    formatWhatsAppMessage({ order, restaurantName = 'Don Food' }) {
        if (!order) return '';
        const o = DefensiveUtils.safeObject(order);
        const safeRestName = DefensiveUtils.safeString(restaurantName || o.companyName, 100, 'Don Food');

        let message = `*💜 Novo Pedido ${o.id || ''} - ${safeRestName}*\n\n`;

        if (o.isScheduled && o.scheduledDate && o.scheduledTime) {
            const [y, m, d] = String(o.scheduledDate).split('-');
            const dateFormatted = (y && m && d) ? `${d}/${m}/${y}` : o.scheduledDate;
            message += `*📅 ENCOMENDA AGENDADA*\n`;
            message += `📆 Data: *${dateFormatted}*\n`;
            message += `⏰ Horário: *${o.scheduledTime}*\n\n`;
        } else {
            message += `*⚡ PEDIDO IMEDIATO*\n\n`;
        }

        message += `*📋 DADOS DO CLIENTE & ENTREGA*\n`;
        message += `👤 Nome: ${DefensiveUtils.safeString(o.customerName)}\n`;
        if (o.customerNeighborhood) {
            message += `🛵 Bairro / Região: ${o.customerNeighborhood}${o.customerNeighborhoodZone ? ` (${o.customerNeighborhoodZone})` : ''}\n`;
        }
        message += `📍 Endereço: ${DefensiveUtils.safeString(o.customerAddress)}\n`;
        if (o.customerReference) {
            message += `🎯 Ponto de Referência: ${o.customerReference}\n`;
        }
        message += `📱 Telefone: ${DefensiveUtils.safeString(o.customerPhone)}\n\n`;

        message += `*💳 FORMA DE PAGAMENTO*\n• ${DefensiveUtils.safeString(o.paymentMethod, 100, 'Pix')}\n\n`;

        if (!o.isScheduled) {
            message += `*⏱️ PREVISÃO DE ENTREGA*\n• ~${DefensiveUtils.safeString(o.deliveryTime, 50, '30 - 45 min')}\n\n`;
        }

        message += `*🛒 ITENS DO PEDIDO*\n`;
        DefensiveUtils.safeArray(o.items).forEach(item => {
            const qty = DefensiveUtils.safeInteger(item.quantity, 1);
            const price = DefensiveUtils.safeNumber(item.price, 0);
            message += `• *${qty}x ${DefensiveUtils.safeString(item.name)}*\n`;
            if (item.details) {
                message += `   🥣 _Ingredientes: ${DefensiveUtils.safeString(item.details)}_\n`;
            }
            message += `   Valor unitário: ${DefensiveUtils.formatCurrency(price)}\n`;
            message += `   Subtotal: ${DefensiveUtils.formatCurrency(price * qty)}\n\n`;
        });

        message += `------------------------------\n`;
        message += `Subtotal: ${DefensiveUtils.formatCurrency(o.subtotal)}\n`;
        if (o.discountValue > 0 && o.couponCode) {
            message += `🏷️ *Cupom de Desconto:* ${o.couponCode} (${o.couponDiscount}% OFF = -${DefensiveUtils.formatCurrency(o.discountValue)})\n`;
        }
        message += `Taxa de Entrega: ${DefensiveUtils.formatCurrency(o.deliveryFee)}\n`;
        message += `*💰 TOTAL: ${DefensiveUtils.formatCurrency(o.total)}*\n\n`;
        message += 'Aguardo confirmação! Obrigado! 😊';

        return message;
    }
};

export const EscPosReceiptBuilder = {
    generateCommands(order, { paperWidth = 58, storeName = 'DON FOOD', storeAddress = '', storeCnpj = '', storeInstagram = '' } = {}) {
        const encoder = new TextEncoder();
        const cols = paperWidth === 80 ? 48 : 32;
        const line = '-'.repeat(cols) + '\n';
        const doubleLine = '='.repeat(cols) + '\n';

        let text = '';
        text += '\x1B\x40';
        text += '\x1B\x61\x01';
        text += '\x1D\x21\x11';
        text += `${storeName.toUpperCase()}\n`;
        text += '\x1D\x21\x00';
        if (storeCnpj) text += `CNPJ: ${storeCnpj}\n`;
        if (storeAddress) text += `${storeAddress}\n`;
        text += `COMPROVANTE DE PEDIDO ${paperWidth}MM\n`;
        text += doubleLine;

        text += '\x1B\x61\x00';
        text += `PEDIDO  : ${order.id || '#0000'}\n`;
        text += `DATA    : ${order.date || 'Hoje'}\n`;

        // NOVO: Encomenda agendada
        if (order.isScheduled && order.scheduledDate && order.scheduledTime) {
            text += `ENCOMENDA: ${order.scheduledDate} ${order.scheduledTime}\n`;
        }

        text += `CLIENTE : ${order.customerName || 'Cliente'}\n`;
        text += `TEL     : ${order.customerPhone || '-'}\n`;
        if (order.customerNeighborhood) {
            text += `BAIRRO  : ${order.customerNeighborhood}${order.customerNeighborhoodZone ? ` (${order.customerNeighborhoodZone})` : ''}\n`;
        }
        text += `ENDERECO: ${order.customerAddress || '-'}\n`;
        if (order.customerReference) text += `REF     : ${order.customerReference}\n`;
        text += `PAGAMENTO: ${order.paymentMethod || 'Pix'}\n`;
        if (!order.isScheduled) {
            text += `PREVISAO : ${order.deliveryTime || '30 - 45 min'}\n`;
        }
        text += line;

        text += 'ITENS SOLICITADOS:\n';
        DefensiveUtils.safeArray(order.items).forEach(item => {
            const qty = DefensiveUtils.safeInteger(item.quantity, 1);
            const price = DefensiveUtils.safeNumber(item.price, 0);
            text += `${qty}x ${item.name || 'Item'}\n`;
            if (item.details) text += `  > ${item.details}\n`;
            text += `  Valor: ${DefensiveUtils.formatCurrency(price * qty)}\n`;
        });
        text += line;

        const subtotal = DefensiveUtils.safeNumber(order.subtotal, 0);
        const discount = DefensiveUtils.safeNumber(order.discountValue || order.discount, 0);
        const deliveryFee = DefensiveUtils.safeNumber(order.deliveryFee, 0);
        const total = DefensiveUtils.safeNumber(order.total, 0);

        if (subtotal > 0) text += `Subtotal : ${DefensiveUtils.formatCurrency(subtotal)}\n`;
        if (discount > 0) text += `Desconto : -${DefensiveUtils.formatCurrency(discount)} (${order.couponCode || 'Cupom'})\n`;
        text += `Taxa Ent : ${DefensiveUtils.formatCurrency(deliveryFee)}\n`;

        text += '\x1D\x21\x01';
        text += `TOTAL    : ${DefensiveUtils.formatCurrency(total)}\n`;
        text += '\x1D\x21\x00';
        text += doubleLine;

        text += '\x1B\x61\x01';
        text += 'Obrigado pela preferencia!\n';
        if (storeInstagram) text += `${storeInstagram}\n`;
        text += '\n\n\n\n';
        text += '\x1D\x56\x00';

        return encoder.encode(text);
    }
};