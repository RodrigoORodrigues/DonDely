/**
 * ============================================================================
 * DON FOOD - SISTEMA COMPLETO DE CARDÁPIO DIGITAL & GESTÃO MULTI-EMPRESA
 * ============================================================================
 * @description Sistema SPA completo em JavaScript Vanilla para delivery, catálogo
 * interativo, customização de produtos ('Monte do seu jeito'), carrinho de compras,
 * checkout via WhatsApp, impressão de recibo térmico (58mm/Bluetooth/USB),
 * gestão multi-empresa com troca de temas em 1 clique e isolamento de pedidos.
 *
 * MÓDULOS E ESTRUTURAÇÃO DO CÓDIGO:
 * 1.  Modelos de Dados & Catálogos Padrão (PRESET_CATALOGS_BY_CATEGORY)
 * 2.  Ingredientes & Acompanhamentos Dinâmicos (INGREDIENTS_BY_CATEGORY)
 * 3.  Temas Visuais & Paletas de Cores (THEME_PRESETS)
 * 4.  Banners Promocionais & Promoções por Categoria
 * 5.  Estado Global & Armazenamento Local (localStorage)
 * 6.  Arquitetura Multi-Empresa Universal & Isolamento de Dados
 * 7.  Renderização do Cardápio & Filtro de Categorias
 * 8.  Customizador de Produto Interativo (Monte do Seu Jeito - 3 Grátis + Extras)
 * 9.  Carrinho de Compras & Cálculo de Taxa/Subtotal/Total
 * 10. Checkout Inteligente & Geração de Mensagem Formatada para WhatsApp
 * 11. Histórico de Pedidos do Cliente & Rastreamento em Tempo Real
 * 12. Painel Administrativo, Cadastro de Produtos & Configurações da Empresa
 * 13. Módulo de Impressão Térmica ESC/POS (MTI-773, Web Bluetooth & Web Serial USB)
 * 14. Inicialização do Sistema & Event Listeners
 * ============================================================================
 */

// ========== DADOS INICIAIS BASEADOS NO PANFLETO ==========
        const defaultProducts = [
            {
                id: 1,
                name: 'Super Barca de Açaí - O mais pedido!',
                tag: '🔥 O MAIS PEDIDO!',
                description: 'Super Barca Recheada! Acompanha Kiwi, Banana, Cereais, Chocolate Flakes, Granulado, Cremes Especiais e Wafer + 3 acompanhamentos grátis da sua escolha.',
                price: 34.99,
                image: 'super_barca.svg',
                available: true,
                isAcai: true
            },
            {
                id: 2,
                name: 'Açaí 300ML',
                description: 'Direito a 3 ingredientes grátis! (Ex: 1 Fruta + 1 Calda + 1 Cereal, ou como preferir).',
                price: 18.99,
                image: 'acai_300ml.svg',
                available: true,
                isAcai: true
            },
            {
                id: 3,
                name: 'Açaí 400ML (Na Quentinha)',
                description: 'Açaí na Quentinha! Direito a 3 ingredientes grátis (Ex: 1 Fruta + 1 Calda + 1 Cereal).',
                price: 18.99,
                image: 'acai_quentinha.svg',
                available: true,
                isAcai: true
            },
            {
                id: 4,
                name: 'Nutella (Recheio e Cobertura)',
                description: 'Adicional especial de Nutella cremosa (R$ 4,00)',
                price: 4.00,
                image: 'https://images.unsplash.com/photo-1588666304523-28956e257eb4?w=400&h=300&fit=crop',
                available: true
            },
            {
                id: 5,
                name: 'Leite em Pó Ninho (Adicional)',
                description: 'Porção adicional de leite em pó Ninho (R$ 3,00)',
                price: 3.00,
                image: 'leite_ninho.svg',
                available: true
            },
            {
                id: 6,
                name: 'Morango Fresco',
                description: 'Porção extra de morango fatiado fresco',
                price: 3.00,
                image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop',
                available: true
            },
            {
                id: 7,
                name: 'Banana Caramelizada',
                description: 'Doce especial de banana caramelizada',
                price: 3.00,
                image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&h=300&fit=crop',
                available: true
            },
            {
                id: 8,
                name: 'M&M\'s / Jujubas / Granulado',
                description: 'Confetes M&M\'s e doces crocantes',
                price: 2.50,
                image: 'https://images.unsplash.com/photo-1620864353272-4d0fb69fc5f3?w=400&h=300&fit=crop',
                available: true
            }
        ];

        // CATÁLOGO DE INGREDIENTES E ACOMPANHAMENTOS POR CATEGORIA DE ESTABELECIMENTO
        const INGREDIENTS_BY_CATEGORY = {
            acai: [
                {
                    category: '🍓 Frutas Frescas',
                    items: [
                        { name: 'Morango', price: 0, tag: 'Grátis' },
                        { name: 'Banana', price: 0, tag: 'Grátis' },
                        { name: 'Kiwi', price: 0, tag: 'Grátis' },
                        { name: 'Manga', price: 0, tag: 'Grátis' }
                    ]
                },
                {
                    category: '🥣 Cereais e Crocantes',
                    items: [
                        { name: 'Granola', price: 0, tag: 'Grátis' },
                        { name: 'Sucrilhos de Milho', price: 0, tag: 'Grátis' },
                        { name: 'Cereal Ball Mesclado', price: 0, tag: 'Grátis' },
                        { name: 'Argolinha Frutas Cítricas', price: 0, tag: 'Grátis' },
                        { name: 'Flocos Crocantes de Chocolate', price: 0, tag: 'Grátis' },
                        { name: 'Castanha', price: 0, tag: 'Grátis' },
                        { name: 'Paçoca', price: 0, tag: 'Grátis' },
                        { name: 'M&M\'s', price: 0, tag: 'Grátis' },
                        { name: 'Granulado Crocante Colorido', price: 0, tag: 'Grátis' },
                        { name: 'Jujuba', price: 0, tag: 'Grátis' }
                    ]
                },
                {
                    category: '🍫 Caldas & Coberturas',
                    items: [
                        { name: 'Nutella (Recheio & Cobertura)', price: 4.00, tag: '+R$ 4,00' },
                        { name: 'Leite em Pó Ninho', price: 3.00, tag: '+R$ 3,00' },
                        { name: 'Recheio e Cobertura de Chocolate', price: 0, tag: 'Grátis' },
                        { name: 'Leite Condensado', price: 0, tag: 'Grátis' }
                    ]
                },
                {
                    category: '🍌 Doces Especiais',
                    items: [
                        { name: 'Banana Caramelizada', price: 0, tag: 'Grátis' },
                        { name: 'Jujubas Especiais', price: 0, tag: 'Grátis' }
                    ]
                }
            ],
            marmitaria: [
                {
                    category: '🍳 Ovos e Proteínas Especiais',
                    items: [
                        { name: 'Ovo Frito de Gema Mole', price: 0, tag: 'Grátis' },
                        { name: 'Ovo Cozido Fatiado', price: 0, tag: 'Grátis' },
                        { name: 'Queijo Coalho Grelhado', price: 4.00, tag: '+R$ 4,00' },
                        { name: 'Torresmo Pururuca Crocante', price: 3.50, tag: '+R$ 3,50' }
                    ]
                },
                {
                    category: '🥗 Guarnições e Acompanhamentos Caseiros',
                    items: [
                        { name: 'Farofa Crocante de Bacon', price: 0, tag: 'Grátis' },
                        { name: 'Banana Frita na Manteiga', price: 0, tag: 'Grátis' },
                        { name: 'Salada de Maionese Caseira', price: 0, tag: 'Grátis' },
                        { name: 'Vinagrete Fresco da Casa', price: 0, tag: 'Grátis' },
                        { name: 'Couve Refogada na Manteiga', price: 0, tag: 'Grátis' },
                        { name: 'Batata Palha Crocante', price: 0, tag: 'Grátis' }
                    ]
                },
                {
                    category: '🍟 Porções Extras & Acompanhamentos',
                    items: [
                        { name: 'Porção Extra de Batata Frita', price: 6.00, tag: '+R$ 6,00' },
                        { name: 'Feijão Tropeiro Caprichado', price: 5.00, tag: '+R$ 5,00' }
                    ]
                }
            ],
            burguer: [
                {
                    category: '🥓 Adicionais e Queijos Derretidos',
                    items: [
                        { name: 'Bacon Crocante Fatiado', price: 4.50, tag: '+R$ 4,50' },
                        { name: 'Cheddar Cremoso Extra', price: 3.50, tag: '+R$ 3,50' },
                        { name: 'Catupiry Original Empanado', price: 4.00, tag: '+R$ 4,00' },
                        { name: 'Cebola Caramelizada', price: 0, tag: 'Grátis' },
                        { name: 'Ovo Frito na Chapa', price: 0, tag: 'Grátis' },
                        { name: 'Picles de Pepino Artesanal', price: 0, tag: 'Grátis' },
                        { name: 'Hambúrguer Smash Extra (80g)', price: 8.00, tag: '+R$ 8,00' }
                    ]
                },
                {
                    category: '🥫 Molhos Especiais da Casa',
                    items: [
                        { name: 'Maionese Verde Temperada', price: 0, tag: 'Grátis' },
                        { name: 'Molho Barbecue Defumado', price: 0, tag: 'Grátis' },
                        { name: 'Maionese de Alho Assado', price: 0, tag: 'Grátis' },
                        { name: 'Maionese de Pimenta Defumada', price: 0, tag: 'Grátis' }
                    ]
                }
            ],
            pizzaria: [
                {
                    category: '🧀 Bordas Recheadas Especiais',
                    items: [
                        { name: 'Borda Recheada de Catupiry Original', price: 8.00, tag: '+R$ 8,00' },
                        { name: 'Borda Recheada de Cheddar Cremoso', price: 8.00, tag: '+R$ 8,00' },
                        { name: 'Borda Doce de Nutella Pura', price: 10.00, tag: '+R$ 10,00' }
                    ]
                },
                {
                    category: '🍕 Adicionais e Coberturas Extras',
                    items: [
                        { name: 'Bacon Crocante Extra', price: 5.00, tag: '+R$ 5,00' },
                        { name: 'Cogumelos Champignon', price: 6.00, tag: '+R$ 6,00' },
                        { name: 'Azeitonas Pretas Fatiadas', price: 0, tag: 'Grátis' },
                        { name: 'Parmesão Ralado na Hora', price: 4.00, tag: '+R$ 4,00' },
                        { name: 'Milho Verde Selecionado', price: 0, tag: 'Grátis' },
                        { name: 'Manjericão Fresco', price: 0, tag: 'Grátis' }
                    ]
                }
            ],
            sorveteria: [
                {
                    category: '🍓 Frutas Frescas Selecionadas',
                    items: [
                        { name: 'Morango Fresco Fatiado', price: 0, tag: 'Grátis' },
                        { name: 'Banana Fatiada', price: 0, tag: 'Grátis' },
                        { name: 'Kiwi Selecionado', price: 0, tag: 'Grátis' },
                        { name: 'Amora Fresca', price: 0, tag: 'Grátis' }
                    ]
                },
                {
                    category: '🍫 Caldas & Coberturas',
                    items: [
                        { name: 'Nutella Pura Belga', price: 4.00, tag: '+R$ 4,00' },
                        { name: 'Leite Ninho Polvilhado', price: 3.00, tag: '+R$ 3,00' },
                        { name: 'Calda de Morango Artesanal', price: 0, tag: 'Grátis' },
                        { name: 'Calda de Caramel Fudge', price: 0, tag: 'Grátis' },
                        { name: 'Calda de Chocolate Quente', price: 0, tag: 'Grátis' }
                    ]
                },
                {
                    category: '🍬 Confeites & Crocantes',
                    items: [
                        { name: 'M&Ms Crocantes', price: 0, tag: 'Grátis' },
                        { name: 'Bis de Chocolate Picado', price: 0, tag: 'Grátis' },
                        { name: 'Cereal Chocoball', price: 0, tag: 'Grátis' },
                        { name: 'Granulado Colorido', price: 0, tag: 'Grátis' }
                    ]
                }
            ],
            confeitaria: [
                {
                    category: '🧁 Recheios Gourmet',
                    items: [
                        { name: 'Nutella Pura Belga', price: 4.50, tag: '+R$ 4,50' },
                        { name: 'Morangos Selecionados', price: 3.50, tag: '+R$ 3,50' },
                        { name: 'Creme Ninho Tradicional', price: 0, tag: 'Grátis' },
                        { name: 'Beijinho de Coco Cremoso', price: 0, tag: 'Grátis' },
                        { name: 'Doce de Leite Artesanal', price: 0, tag: 'Grátis' }
                    ]
                },
                {
                    category: '🍫 Coberturas Finas',
                    items: [
                        { name: 'Ganache de Chocolate Meio Amargo', price: 0, tag: 'Grátis' },
                        { name: 'Raspas de Chocolate Belga', price: 0, tag: 'Grátis' },
                        { name: 'Confeitos de Miçanga', price: 0, tag: 'Grátis' }
                    ]
                }
            ],
            fastfood: [
                {
                    category: '🍟 Acompanhamentos Crocantes',
                    items: [
                        { name: 'Batata Frita P', price: 8.00, tag: '+R$ 8,00' },
                        { name: 'Onion Rings Crocantes (6un)', price: 10.00, tag: '+R$ 10,00' },
                        { name: 'Cheddar & Bacon na Batata', price: 5.00, tag: '+R$ 5,00' },
                        { name: 'Nuggets Crocantes (4un)', price: 8.00, tag: '+R$ 8,00' }
                    ]
                },
                {
                    category: '🥫 Molhos da Casa',
                    items: [
                        { name: 'Molho Especial da Casa', price: 0, tag: 'Grátis' },
                        { name: 'Maionese Grill Defumada', price: 0, tag: 'Grátis' },
                        { name: 'Molho Mustard & Honey', price: 0, tag: 'Grátis' }
                    ]
                }
            ],
            darkgourmet: [
                {
                    category: '🥩 Molhos & Guarnições Nobles',
                    items: [
                        { name: 'Redução de Vinho Rótulo Ouro', price: 8.00, tag: '+R$ 8,00' },
                        { name: 'Risoto de Cogumelos Trufados', price: 12.00, tag: '+R$ 12,00' },
                        { name: 'Aligot de Queijo da Canastra', price: 10.00, tag: '+R$ 10,00' },
                        { name: 'Aspargos Grelhados no Azeite', price: 7.00, tag: '+R$ 7,00' }
                    ]
                }
            ]
        };

        const ALL_INGREDIENTS = INGREDIENTS_BY_CATEGORY.acai;

        function getIngredientsForActiveCompany() {
            const activeComp = getActiveCompany();
            const customExtras = (activeComp && activeComp.customExtras) || settings.customExtras;
            
            if (customExtras && Array.isArray(customExtras.categories) && customExtras.categories.length > 0) {
                const validCategories = customExtras.categories.filter(cat => Array.isArray(cat.chips) && cat.chips.some(chip => (chip.name || '').trim() !== ''));
                if (validCategories.length > 0) {
                    return validCategories.map(cat => ({
                        category: cat.name || 'Acompanhamentos',
                        items: (cat.chips || []).filter(chip => (chip.name || '').trim() !== '').map(chip => {
                            let isFree = chip.isFree === true;
                            let priceNum = 0;
                            if (chip.price !== undefined && chip.price !== null && chip.price !== '') {
                                if (typeof chip.price === 'number') {
                                    priceNum = chip.price;
                                } else {
                                    const cleaned = String(chip.price).replace(/[^\d.,]/g, '').replace(',', '.');
                                    priceNum = parseFloat(cleaned) || 0;
                                }
                            }
                            if (priceNum === 0 || chip.price === '' || chip.price === '0' || chip.price === 'Grátis' || chip.price === 'gratis') {
                                isFree = true;
                                priceNum = 0;
                            }
                            return {
                                name: `${chip.icon ? chip.icon + ' ' : ''}${chip.name}`,
                                price: isFree ? 0 : priceNum,
                                tag: isFree ? 'Grátis' : `+R$ ${priceNum.toFixed(2).replace('.', ',')}`
                            };
                        })
                    }));
                }
            }

            const presetKey = getActiveCompanyPresetType();
            return INGREDIENTS_BY_CATEGORY[presetKey] || INGREDIENTS_BY_CATEGORY.acai;
        }

        // ========== CUPONS DE DESCONTO PADRÃO ==========
        const defaultCoupons = [
            { code: 'BEMVINDO10', discount: 10, description: '10% de desconto no primeiro pedido', active: true },
            { code: 'PROMO15', discount: 15, description: '15% de desconto especial', active: true },
            { code: 'DONFIM20', discount: 20, description: '20% de super desconto', active: true }
        ];

        // ========== BAIRROS E TAXAS DE ENTREGA PADRÃO (ZONA SUL, ZONA NORTE, CENTRO) ==========
        const DEFAULT_DELIVERY_NEIGHBORHOODS = [
            // 🏙️ CENTRO
            { id: 'b-centro', name: 'Centro', zone: 'centro', zoneName: 'Centro', fee: 5.00, time: '20 - 35 min', active: true },
            { id: 'b-lapa', name: 'Lapa', zone: 'centro', zoneName: 'Centro', fee: 5.00, time: '20 - 35 min', active: true },
            { id: 'b-santa-teresa', name: 'Santa Teresa', zone: 'centro', zoneName: 'Centro', fee: 7.00, time: '30 - 45 min', active: true },
            { id: 'b-fatima', name: 'Bairro de Fátima', zone: 'centro', zoneName: 'Centro', fee: 5.00, time: '25 - 35 min', active: true },
            { id: 'b-estacio', name: 'Estácio', zone: 'centro', zoneName: 'Centro', fee: 6.00, time: '25 - 35 min', active: true },
            { id: 'b-catumbi', name: 'Catumbi', zone: 'centro', zoneName: 'Centro', fee: 6.00, time: '25 - 40 min', active: true },
            { id: 'b-rio-comprido', name: 'Rio Comprido', zone: 'centro', zoneName: 'Centro', fee: 6.00, time: '25 - 40 min', active: true },
            { id: 'b-cidade-nova', name: 'Cidade Nova', zone: 'centro', zoneName: 'Centro', fee: 5.00, time: '20 - 35 min', active: true },
            { id: 'b-praca-maua', name: 'Praça Mauá / Saúde', zone: 'centro', zoneName: 'Centro', fee: 6.00, time: '25 - 40 min', active: true },
            { id: 'b-gamboa', name: 'Gamboa / Santo Cristo', zone: 'centro', zoneName: 'Centro', fee: 6.00, time: '25 - 40 min', active: true },

            // 🌊 ZONA SUL
            { id: 'b-copacabana', name: 'Copacabana', zone: 'zona_sul', zoneName: 'Zona Sul', fee: 8.00, time: '30 - 45 min', active: true },
            { id: 'b-leme', name: 'Leme', zone: 'zona_sul', zoneName: 'Zona Sul', fee: 8.00, time: '30 - 45 min', active: true },
            { id: 'b-ipanema', name: 'Ipanema', zone: 'zona_sul', zoneName: 'Zona Sul', fee: 8.00, time: '35 - 50 min', active: true },
            { id: 'b-leblon', name: 'Leblon', zone: 'zona_sul', zoneName: 'Zona Sul', fee: 10.00, time: '35 - 50 min', active: true },
            { id: 'b-botafogo', name: 'Botafogo', zone: 'zona_sul', zoneName: 'Zona Sul', fee: 6.00, time: '25 - 40 min', active: true },
            { id: 'b-flamengo', name: 'Flamengo', zone: 'zona_sul', zoneName: 'Zona Sul', fee: 6.00, time: '25 - 40 min', active: true },
            { id: 'b-catete', name: 'Catete', zone: 'zona_sul', zoneName: 'Zona Sul', fee: 6.00, time: '25 - 40 min', active: true },
            { id: 'b-gloria', name: 'Glória', zone: 'zona_sul', zoneName: 'Zona Sul', fee: 6.00, time: '25 - 40 min', active: true },
            { id: 'b-laranjeiras', name: 'Laranjeiras', zone: 'zona_sul', zoneName: 'Zona Sul', fee: 7.00, time: '30 - 45 min', active: true },
            { id: 'b-cosme-velho', name: 'Cosme Velho', zone: 'zona_sul', zoneName: 'Zona Sul', fee: 7.00, time: '30 - 45 min', active: true },
            { id: 'b-humaita', name: 'Humaitá', zone: 'zona_sul', zoneName: 'Zona Sul', fee: 7.00, time: '30 - 45 min', active: true },
            { id: 'b-urca', name: 'Urca', zone: 'zona_sul', zoneName: 'Zona Sul', fee: 8.00, time: '30 - 45 min', active: true },
            { id: 'b-jardim-botanico', name: 'Jardim Botânico', zone: 'zona_sul', zoneName: 'Zona Sul', fee: 10.00, time: '40 - 55 min', active: true },
            { id: 'b-gavea', name: 'Gávea', zone: 'zona_sul', zoneName: 'Zona Sul', fee: 10.00, time: '40 - 55 min', active: true },
            { id: 'b-sao-conrado', name: 'São Conrado', zone: 'zona_sul', zoneName: 'Zona Sul', fee: 12.00, time: '45 - 60 min', active: true },

            // 🌳 ZONA NORTE
            { id: 'b-tijuca', name: 'Tijuca', zone: 'zona_norte', zoneName: 'Zona Norte', fee: 6.00, time: '25 - 40 min', active: true },
            { id: 'b-maracana', name: 'Maracanã', zone: 'zona_norte', zoneName: 'Zona Norte', fee: 6.00, time: '25 - 40 min', active: true },
            { id: 'b-vila-isabel', name: 'Vila Isabel', zone: 'zona_norte', zoneName: 'Zona Norte', fee: 7.00, time: '30 - 45 min', active: true },
            { id: 'b-grajau', name: 'Grajaú', zone: 'zona_norte', zoneName: 'Zona Norte', fee: 7.00, time: '30 - 45 min', active: true },
            { id: 'b-andarai', name: 'Andaraí', zone: 'zona_norte', zoneName: 'Zona Norte', fee: 7.00, time: '30 - 45 min', active: true },
            { id: 'b-sao-cristovao', name: 'São Cristóvão', zone: 'zona_norte', zoneName: 'Zona Norte', fee: 6.00, time: '25 - 40 min', active: true },
            { id: 'b-meier', name: 'Méier', zone: 'zona_norte', zoneName: 'Zona Norte', fee: 9.00, time: '40 - 55 min', active: true },
            { id: 'b-engenho-novo', name: 'Engenho Novo', zone: 'zona_norte', zoneName: 'Zona Norte', fee: 9.00, time: '40 - 55 min', active: true },
            { id: 'b-engenho-dentro', name: 'Engenho de Dentro', zone: 'zona_norte', zoneName: 'Zona Norte', fee: 10.00, time: '40 - 55 min', active: true },
            { id: 'b-cachambi', name: 'Cachambi', zone: 'zona_norte', zoneName: 'Zona Norte', fee: 10.00, time: '40 - 55 min', active: true },
            { id: 'b-del-castilho', name: 'Del Castilho / Inhaúma', zone: 'zona_norte', zoneName: 'Zona Norte', fee: 11.00, time: '45 - 60 min', active: true },
            { id: 'b-bonsucesso', name: 'Bonsucesso / Ramos', zone: 'zona_norte', zoneName: 'Zona Norte', fee: 11.00, time: '45 - 60 min', active: true },
            { id: 'b-madureira', name: 'Madureira / Cascadura', zone: 'zona_norte', zoneName: 'Zona Norte', fee: 13.00, time: '50 - 65 min', active: true },
            { id: 'b-penha', name: 'Penha / Olaria', zone: 'zona_norte', zoneName: 'Zona Norte', fee: 12.00, time: '50 - 65 min', active: true }
        ];

        const defaultSettings = {
            restaurantName: 'Don Food',
            subtitle: 'Cardápio Digital & Delivery Oficial! Faça seu pedido teste e monte do seu jeito.',
            whatsappNumber: '5521999999999',
            instagram: '@donfood',
            cnpj: '00.000.000/0001-99',
            address: 'Av. Brasil, 500 - Loja Modelo',
            logoUrl: 'Logo_Don.png',
            adminPassword: 'admin',
            deliveryFee: 5.00,
            deliveryTime: '25 - 40 min',
            presetType: 'burguer',
            coupons: defaultCoupons,
            deliveryNeighborhoods: DEFAULT_DELIVERY_NEIGHBORHOODS,
            schedule: {
                monday: { enabled: true, open: '09:00', close: '22:00' },
                tuesday: { enabled: true, open: '09:00', close: '22:00' },
                wednesday: { enabled: true, open: '09:00', close: '22:00' },
                thursday: { enabled: true, open: '09:00', close: '22:00' },
                friday: { enabled: true, open: '09:00', close: '22:00' },
                saturday: { enabled: true, open: '09:00', close: '23:00' },
                sunday: { enabled: true, open: '09:00', close: '22:00' }
            }
        };

        // ========== PALETAS DE CORES & PRESETS DO SISTEMA UNIVERSAL ==========
        const THEME_PRESETS = {
            demo: {
                name: '🔥 Don Food Sunset (Vermelho, Laranja & Amarelo)',
                primary: '#DC2626',
                primaryDark: '#991B1B',
                secondary: '#EA580C',
                bgAccent: '#FFFDF7'
            },
            burguer: {
                name: '🟧 Hamburgueria Sunset Flame (Laranja & Fogo)',
                primary: '#EA580C',
                primaryDark: '#9A3412',
                secondary: '#F59E0B',
                bgAccent: '#FFF7ED'
            },
            fastfood: {
                name: '🔴 Fast Food Red & Amber (Vermelho & Dourado)',
                primary: '#DC2626',
                primaryDark: '#991B1B',
                secondary: '#F59E0B',
                bgAccent: '#FEF2F2'
            },
            darkgourmet: {
                name: '🖤 Gourmet Midnight Gold',
                primary: '#18181B',
                primaryDark: '#09090B',
                secondary: '#D4AF37',
                bgAccent: '#FAF8F5'
            },
            acai: {
                name: '🟣 Açaí Roxo Imperial',
                primary: '#581C87',
                primaryDark: '#3B0764',
                secondary: '#9333EA',
                bgAccent: '#FAF5FF'
            },
            pizzaria: {
                name: '🟢 Pizzaria Basil Emerald',
                primary: '#059669',
                primaryDark: '#064E3B',
                secondary: '#10B981',
                bgAccent: '#ECFDF5'
            },
            sorveteria: {
                name: '🔵 Sorveteria Azure Sky',
                primary: '#0284C7',
                primaryDark: '#0369A1',
                secondary: '#38BDF8',
                bgAccent: '#F0F9FF'
            },
            marmitaria: {
                name: '🍱 Marmitaria Caseira & Sabor (Âmbar & Terracota)',
                primary: '#D97706',
                primaryDark: '#92400E',
                secondary: '#F59E0B',
                bgAccent: '#FFFBEB'
            },
            confeitaria: {
                name: '🌸 Confeitaria Sweet Berry',
                primary: '#DB2777',
                primaryDark: '#9D174D',
                secondary: '#F472B6',
                bgAccent: '#FDF2F8'
            }
        };

        // CATALOGOS INICIAIS DE PRODUTOS PARA NOVAS EMPRESAS
        const MENU_PRESETS = {
            acai: defaultProducts,
            burguer: [
                { id: 101, name: 'Combo X-Burguer Artesanal Duplo', tag: '🔥 O MAIS PEDIDO!', description: 'Hambúrguer duplo 160g de blend artesanal, cheddar cremoso, bacon crocante + Batata Frita + Refrigerante', price: 32.90, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&fit=crop', available: true },
                { id: 102, name: 'Smash Burguer Bacon Especial', tag: '⚡ NOVIDADE', description: 'Duas carnes smash 80g, queijo cheddar fatiado, bacon crocante e maionese artesanal defumada', price: 24.90, image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&fit=crop', available: true },
                { id: 103, name: 'Porção de Batata Frita Crocante (300g)', description: 'Batata frita bem crocante servida com molho de queijo cheddar e bacon em cubinhos', price: 16.00, image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&fit=crop', available: true },
                { id: 104, name: 'Refrigerante Lata 350ml', description: 'Coca-Cola, Guaraná Antarctica ou Sprite geladinhos', price: 6.00, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&fit=crop', available: true }
            ],
            pizzaria: [
                { id: 201, name: 'Pizza Grande Calabresa Especial', tag: '🔥 CAMPEÃO DE VENDAS', description: 'Massa artesanal, molho de tomate fresco, muita calabresa fatiada, cebola roxa e azeitonas pretas', price: 45.00, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&fit=crop', available: true },
                { id: 202, name: 'Pizza Quatro Queijos Cremosa', description: 'Mussarela, catupiry original, provolone e gorgonzola com orégano fresco', price: 48.00, image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?w=500&fit=crop', available: true },
                { id: 203, name: 'Pizza Brotinho Doce de Leite com Morango', description: 'Massa fininha recheada com doce de leite cremoso e fatias de morango', price: 28.00, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&fit=crop', available: true },
                { id: 204, name: 'Guaraná Antarctica 2 Litros', description: 'Refrigerante Guaraná 2L trincando de gelado', price: 12.00, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&fit=crop', available: true }
            ],
            marmitaria: [
                { id: 301, name: 'Marmita Executiva Bife Acebolado', tag: '⭐ TRADICIONAL', description: 'Bife acebolado macio, arroz branco soltinho, feijão caseiro, farofa crocante e salada de alface', price: 22.00, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&fit=crop', available: true },
                { id: 302, name: 'Marmita Feijoada Completa', tag: '🔥 SEXTA & SÁBADO', description: 'Feijoada saborosa com carne seca, costelinha e calabresa + couve refogada, farofa e laranjinha', price: 26.00, image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&fit=crop', available: true },
                { id: 303, name: 'Suco Natural de Laranja 500ml', description: 'Suco 100% natural feito na hora sem adição de açúcar', price: 8.00, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&fit=crop', available: true }
            ],
            confeitaria: [
                { id: 401, name: 'Torta Holandesa de Chocolate (Fatia)', tag: '🍰 SUPREMO', description: 'Deliciosa fatia de torta holandesa com creme suave de baunilha e cobertura de ganache meio amargo', price: 14.90, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&fit=crop', available: true },
                { id: 402, name: 'Bolo de Pote Ninho com Nutella', description: 'Massa fofinha de pão de ló intercalada com creme ninho e recheio de Nutella pura', price: 12.00, image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&fit=crop', available: true },
                { id: 403, name: 'Caixa de Brigadeiros Gourmet (6 un)', description: 'Brigadeiros belga artesanais enrolados com confeitos crocantes', price: 18.00, image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&fit=crop', available: true }
            ]
        };

        // ========== VARIÁVEIS GLOBAIS MULTI-EMPRESA ==========
        let companies = [];
        let activeCompanyId = 'company-demo-don';
        let currentAppView = 'landing'; // 'landing' | 'store'

        let products = [];
        let cart = [];
        let appliedCoupon = null;
        let settings = {};
        let editingProductId = null;
        let customerData = null;

        // Cliente Autenticado e Histórico de Pedidos
        let loggedCustomer = null;
        let customerAccounts = [];
        let customerOrders = [];
        let isFetchingOrders = false;
        let knownOrderIds = new Set();

        // ============================================================================
        // ETAPA 2: CENTRALIZADOR DE AUTENTICAÇÃO E PAPÉIS RBAC (SUPER_ADMIN, COMPANY_OWNER, CUSTOMER)
        // ============================================================================
        const ROLES = Object.freeze({
            SUPER_ADMIN: 'SUPER_ADMIN',
            COMPANY_OWNER: 'COMPANY_OWNER',
            CUSTOMER: 'CUSTOMER'
        });

        const AuthManager = {
            getRole() {
                if (sessionStorage.getItem('isDevLoggedIn') === 'true') {
                    return ROLES.SUPER_ADMIN;
                }
                if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
                    return ROLES.COMPANY_OWNER;
                }
                return ROLES.CUSTOMER;
            },
            isSuperAdmin() {
                return sessionStorage.getItem('isDevLoggedIn') === 'true';
            },
            isCompanyOwner(companyId = null) {
                if (this.isSuperAdmin()) return true; // Super Admin tem privilégio irrestrito de gestão
                const isOwner = sessionStorage.getItem('isAdminLoggedIn') === 'true';
                if (!isOwner) return false;
                if (!companyId) return true;
                const currentLoggedComp = sessionStorage.getItem('loggedCompanyId');
                if (!currentLoggedComp) return false;
                return currentLoggedComp === companyId;
            },
            isCustomer() {
                return this.getRole() === ROLES.CUSTOMER;
            },
            isCustomerLoggedIn() {
                return !!loggedCustomer;
            },
            getAuthHeader() {
                const superToken = sessionStorage.getItem('devAuthToken');
                if (superToken) return `Bearer ${superToken}`;
                const companyToken = sessionStorage.getItem('companyAuthToken');
                if (companyToken) return `Bearer ${companyToken}`;
                const customerToken = sessionStorage.getItem('customerAuthToken');
                if (customerToken) return `Bearer ${customerToken}`;
                return null;
            },
            getCurrentUser() {
                const role = this.getRole();
                if (role === ROLES.SUPER_ADMIN) {
                    return {
                        role: ROLES.SUPER_ADMIN,
                        name: 'Super Administrador / Dev',
                        email: 'admin@donfood.com',
                        permissions: ['ALL_COMPANIES', 'MANAGE_DATABASE', 'MIGRATE_CUSTOMERS', 'CREATE_COMPANY', 'EDIT_COMPANY', 'VIEW_METRICS']
                    };
                }
                if (role === ROLES.COMPANY_OWNER) {
                    const comp = companies.find(c => c.id === activeCompanyId) || settings;
                    return {
                        role: ROLES.COMPANY_OWNER,
                        name: comp.name || settings.restaurantName || 'Proprietário da Loja',
                        companyId: activeCompanyId,
                        email: comp.email || '',
                        whatsapp: comp.whatsappNumber || '',
                        permissions: ['MANAGE_PRODUCTS', 'MANAGE_SETTINGS', 'MANAGE_ORDERS', 'VIEW_REPORTS', 'MANAGE_DELIVERY']
                    };
                }
                return {
                    role: ROLES.CUSTOMER,
                    name: loggedCustomer ? loggedCustomer.name : 'Visitante',
                    phone: loggedCustomer ? loggedCustomer.phone : null,
                    address: loggedCustomer ? loggedCustomer.address : null,
                    isGuest: !loggedCustomer,
                    permissions: ['VIEW_MENU', 'PLACE_ORDER', 'TRACK_ORDER', 'MANAGE_PROFILE']
                };
            },
            loginSuperAdmin(token = null) {
                sessionStorage.setItem('isDevLoggedIn', 'true');
                sessionStorage.setItem('currentRole', ROLES.SUPER_ADMIN);
                if (token) sessionStorage.setItem('devAuthToken', token);
                updateAdminHeaderUI();
                updateMobileHeaderMenuUI();
            },
            logoutSuperAdmin() {
                sessionStorage.removeItem('isDevLoggedIn');
                sessionStorage.removeItem('devAuthToken');
                sessionStorage.removeItem('currentRole');
                localStorage.removeItem('isDevLoggedIn');
                closeDevPanelModal();
                updateAdminHeaderUI();
                updateMobileHeaderMenuUI();
                refreshDedicatedLoginUI();
                showNotification('Sessão de Super Administrador encerrada.', 'info');
            },
            loginCompanyOwner(company, token = null) {
                isAdminLoggedIn = true;
                sessionStorage.setItem('isAdminLoggedIn', 'true');
                sessionStorage.setItem('loggedCompanyId', company.id);
                sessionStorage.setItem('currentRole', ROLES.COMPANY_OWNER);
                if (token) sessionStorage.setItem('companyAuthToken', token);
                updateAdminHeaderUI();
                updateMobileHeaderMenuUI();
            },
            logoutCompanyOwner() {
                isAdminLoggedIn = false;
                sessionStorage.removeItem('isAdminLoggedIn');
                sessionStorage.removeItem('loggedCompanyId');
                sessionStorage.removeItem('companyAuthToken');
                sessionStorage.removeItem('currentRole');
                sessionStorage.removeItem('isDevLoggedIn');
                sessionStorage.removeItem('devAuthToken');
                localStorage.removeItem('isAdminLoggedIn');
                localStorage.removeItem('isDevLoggedIn');
                localStorage.removeItem('loggedCompanyId');
                closeAdminPanel();
                updateAdminHeaderUI();
                updateMobileHeaderMenuUI();
                updateCustomerHeaderUI();
                refreshDedicatedLoginUI();
                renderAll();
                showNotification('🚪 Sessão de empresa encerrada com sucesso.', 'info');
            },
            loginCustomer(customer, token = null) {
                loggedCustomer = customer;
                localStorage.setItem('loggedCustomer', JSON.stringify(customer));
                if (token) sessionStorage.setItem('customerAuthToken', token);
                updateCustomerHeaderUI();
                updateAdminHeaderUI();
            },
            logoutCustomer() {
                loggedCustomer = null;
                localStorage.removeItem('loggedCustomer');
                sessionStorage.removeItem('customerAuthToken');
                updateCustomerHeaderUI();
                updateAdminHeaderUI();
            },
            guardAction(requiredRole, actionCallback, fallbackMessage = 'Acesso restrito.') {
                if (requiredRole === ROLES.SUPER_ADMIN && !this.isSuperAdmin()) {
                    showNotification(fallbackMessage || 'Ação restrita ao Super Administrador!', 'warning');
                    openDevPasswordModal();
                    return false;
                }
                if (requiredRole === ROLES.COMPANY_OWNER && !this.isCompanyOwner()) {
                    showNotification(fallbackMessage || 'Ação restrita ao Administrador da Empresa!', 'warning');
                    openAdminLogin();
                    return false;
                }
                if (typeof actionCallback === 'function') {
                    actionCallback();
                }
                return true;
            }
        };

        // ============================================================================
        // ETAPA 3: MODULARIZAÇÃO, FUNÇÕES PURAS E VALIDAÇÃO DEFENSIVA
        // ============================================================================
        const DefensiveUtils = {
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

        // Funções Puras de Cálculo de Frete e Regiões
        const DeliveryFeeEngine = {
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

                // 1. Caso 'other' (bairro customizado digitado)
                if (selectedId === 'other') {
                    neighborhoodName = DefensiveUtils.safeString(customNeighborhoodName) || 
                                       (customerData && DefensiveUtils.safeString(customerData.neighborhood)) || 
                                       'Outro Bairro';
                    neighborhoodZone = 'outra';
                    neighborhoodZoneName = 'Outra Região';
                    return { fee, time, neighborhoodName, neighborhoodZone, neighborhoodZoneName, selectedId };
                }

                // 2. Procura pelo ID ou nome exato na lista ativa
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

                // 3. Fallback para os dados do cliente em cache
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

        // Funções Puras de Validação e Cálculo de Cupons de Desconto
        const CouponEngine = {
            validateAndCalculateCoupon({
                couponCode = '',
                subtotal = 0,
                availableCoupons = []
            } = {}) {
                const safeSubtotal = DefensiveUtils.safeNumber(subtotal, 0, 0);
                const safeCode = DefensiveUtils.safeString(couponCode, 30).toUpperCase();
                const list = DefensiveUtils.safeArray(availableCoupons);

                if (!safeCode) {
                    return {
                        isValid: false,
                        code: '',
                        discount: 0,
                        discountValue: 0,
                        description: '',
                        error: 'Informe o código do cupom.'
                    };
                }

                const found = list.find(c => c && DefensiveUtils.safeString(c.code).toUpperCase() === safeCode);

                if (!found) {
                    return {
                        isValid: false,
                        code: safeCode,
                        discount: 0,
                        discountValue: 0,
                        description: '',
                        error: `Cupom "${safeCode}" não encontrado.`
                    };
                }

                if (found.active === false) {
                    return {
                        isValid: false,
                        code: found.code,
                        discount: 0,
                        discountValue: 0,
                        description: found.description || '',
                        error: `O cupom "${found.code}" está inativo ou pausado.`
                    };
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

        // Funções Puras de Cálculo Geral de Carrinho e Pedido
        const CartOrderCalculator = {
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

                let couponInfo = {
                    isValid: false,
                    code: null,
                    discount: 0,
                    discountValue: 0
                };

                if (appliedCoupon && appliedCoupon.code) {
                    const calc = CouponEngine.validateAndCalculateCoupon({
                        couponCode: appliedCoupon.code,
                        subtotal,
                        availableCoupons
                    });
                    if (calc.isValid) {
                        couponInfo = calc;
                    }
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

        // Funções Puras de Montagem e Formatação de Pedidos
        const OrderMessageBuilder = {
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
                availableCoupons = []
            } = {}) {
                const breakdown = CartOrderCalculator.calculateFullOrderBreakdown({
                    cart,
                    appliedCoupon,
                    deliveryInfo,
                    availableCoupons
                });

                const generatedId = orderId || ('#' + Math.floor(1000 + Math.random() * 9000));
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
                    created_at: new Date().toISOString()
                };
            },

            formatWhatsAppMessage({ order, restaurantName = 'Don Food' }) {
                if (!order) return '';
                const o = DefensiveUtils.safeObject(order);
                const safeRestName = DefensiveUtils.safeString(restaurantName || o.companyName, 100, 'Don Food');
                
                let message = `*💜 Novo Pedido ${o.id || ''} - ${safeRestName}*\n\n`;
                
                // Dados do cliente
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

                // Forma de Pagamento e Previsão de Entrega
                message += `*💳 FORMA DE PAGAMENTO*\n`;
                message += `• ${DefensiveUtils.safeString(o.paymentMethod, 100, 'Pix')}\n\n`;

                message += `*⏱️ PREVISÃO DE ENTREGA*\n`;
                message += `• ~${DefensiveUtils.safeString(o.deliveryTime, 50, '30 - 45 min')}\n\n`;
                
                // Pedido
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

        // Função para alternar visualização de senha de empresas no Painel Dev (apenas para SUPER_ADMIN)
        function toggleCompanyPasswordVisibility(companyId, realPassword) {
            if (!AuthManager.isSuperAdmin()) {
                showNotification('Apenas Super Administradores podem visualizar senhas.', 'warning');
                return;
            }
            const valEl = document.getElementById(`compPassVal_${companyId}`);
            if (!valEl) return;
            if (valEl.dataset.revealed === 'true') {
                valEl.textContent = '••••••••';
                valEl.dataset.revealed = 'false';
            } else {
                valEl.textContent = realPassword || 'admin123';
                valEl.dataset.revealed = 'true';
            }
        }

        // Alerta sonoro agradável e nítido (chime) para novos pedidos recebidos no painel da empresa
        function playNewOrderSound() {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) return;
                const ctx = new AudioCtx();
                if (ctx.state === 'suspended') {
                    ctx.resume();
                }
                const now = ctx.currentTime;
                
                // Triplo tom harmônico de campainha de pedidos (Dó - Mi - Sol)
                const playTone = (freq, startTime, duration, vol) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, startTime);
                    gain.gain.setValueAtTime(vol, startTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(startTime);
                    osc.stop(startTime + duration);
                };

                playTone(523.25, now, 0.45, 0.4);        // C5
                playTone(659.25, now + 0.15, 0.45, 0.45); // E5
                playTone(783.99, now + 0.30, 0.70, 0.5);  // G5
                playTone(1046.50, now + 0.45, 0.90, 0.55); // C6
            } catch (e) {
                // AudioContext não disponível ou restrito
            }
        }

        // Exibir Banner Flutuante de Alerta de Novo Pedido
        let latestReceivedOrder = null;
        let alertBannerTimeout = null;

        function showNewOrderAlert(order) {
            if (!order) return;
            latestReceivedOrder = order;
            playNewOrderSound();

            const banner = document.getElementById('newOrderAlertBanner');
            const titleEl = document.getElementById('newOrderAlertTitle');
            const subEl = document.getElementById('newOrderAlertSubtitle');

            const valFormatted = Number(order.total || 0).toFixed(2).replace('.', ',');
            const storeName = order.companyName || settings.restaurantName || 'Loja';

            if (titleEl) {
                titleEl.innerHTML = `🔔 NOVO PEDIDO RECEBIDO! (${order.id})`;
            }
            if (subEl) {
                subEl.innerHTML = `👤 ${order.customerName || 'Cliente'} • <strong>R$ ${valFormatted}</strong> • 🏬 ${storeName}`;
            }

            if (banner) {
                banner.style.display = 'block';
                if (alertBannerTimeout) clearTimeout(alertBannerTimeout);
                alertBannerTimeout = setTimeout(() => {
                    banner.style.display = 'none';
                }, 12000);
            }

            // Atualizar sino no header se o admin estiver logado
            updateAdminHeaderUI();
        }

        function closeNewOrderAlertBanner(event) {
            if (event) event.stopPropagation();
            const banner = document.getElementById('newOrderAlertBanner');
            if (banner) banner.style.display = 'none';
        }

        function handleOpenNewOrderFromBanner(event) {
            if (event) event.stopPropagation();
            closeNewOrderAlertBanner();
            
            // Se o painel não estiver aberto, abre o painel admin
            if (adminPanel && !adminPanel.classList.contains('active')) {
                if (adminPanel) adminPanel.classList.add('active');
                if (adminOverlay) adminOverlay.classList.add('active');
            }

            // Rolar suavemente até a seção de pedidos do painel de administração
            const ordersSection = document.getElementById('adminOrdersSection');
            if (ordersSection) {
                ordersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Se tiver pedido específico, abrir os detalhes do modal
            if (latestReceivedOrder && latestReceivedOrder.id) {
                setTimeout(() => {
                    openAdminOrderDetailModal(latestReceivedOrder.id);
                }, 300);
            }
        }

        // ============================================================================
        // CANAL REALTIME SUPABASE PARA A TABELA 'orders' & SINCRONIZAÇÃO INSTANTÂNEA
        // ============================================================================
        let supabaseRealtimeClient = null;
        let supabaseRealtimeChannel = null;
        let sseOrderStream = null;

        function normalizeOrderData(ord) {
            if (!ord || typeof ord !== 'object') return null;
            let items = ord.items;
            if (typeof items === 'string') {
                try { items = JSON.parse(items); } catch(e) { items = []; }
            }
            if (!Array.isArray(items)) items = [];
            
            const rawId = String(ord.id || '');
            const id = rawId.startsWith('#') ? rawId : (rawId ? `#${rawId}` : `#${Date.now().toString().slice(-4)}`);
            const companyId = ord.company_id || ord.companyId || activeCompanyId || 'company-demo-don';
            const companyName = ord.company_name || ord.companyName || '';
            const customerName = ord.customer_name || ord.customerName || 'Cliente';
            const customerPhone = ord.customer_phone || ord.customerPhone || '';
            const customerAddress = ord.customer_address || ord.customerAddress || '';
            const customerNeighborhood = ord.customer_neighborhood || ord.customerNeighborhood || '';
            const customerReference = ord.customer_reference || ord.customerReference || '';
            const deliveryTime = ord.delivery_time || ord.deliveryTime || '30 - 45 min';
            const paymentMethod = ord.payment_method || ord.paymentMethod || 'Pix';
            const observations = ord.observations || '';
            const status = ['RECEIVED', 'PREPARING', 'DELIVERING', 'COMPLETED', 'CANCELLED'].includes(ord.status)
                ? ord.status
                : 'RECEIVED';
            const total = Number(ord.total) || 0;
            const subtotal = Number(ord.subtotal) || 0;
            const deliveryFee = Number(ord.delivery_fee || ord.deliveryFee) || 0;
            const discount = Number(ord.discount_value || ord.discount) || 0;
            const date = ord.date || (ord.created_at ? new Date(ord.created_at).toLocaleString('pt-BR') : new Date().toLocaleString('pt-BR'));

            return {
                ...ord,
                id,
                companyId,
                companyName,
                customerName,
                customerPhone,
                customerAddress,
                customerNeighborhood,
                customerReference,
                deliveryTime,
                paymentMethod,
                observations,
                items,
                total,
                subtotal,
                deliveryFee,
                discount,
                status,
                date,
                created_at: ord.created_at || new Date().toISOString(),
                updated_at: ord.updated_at || new Date().toISOString()
            };
        }

        function handleOrderRealtimeChange(eventType, rawOrder) {
            if (!rawOrder) return;
            const order = normalizeOrderData(rawOrder);
            if (!order || !order.id) return;

            const activeCompId = activeCompanyId || 'company-demo-don';
            const matchesActiveCompany = order.companyId === activeCompId || 
                (!order.companyId && activeCompId === 'company-demo-don');

            console.log(`📡 [Realtime Event] ${eventType} para pedido ${order.id} | Loja: ${order.companyId}`);

            if (eventType === 'INSERT') {
                const existingIdx = customerOrders.findIndex(o => 
                    String(o.id) === String(order.id) || 
                    String(o.id).replace('#', '') === String(order.id).replace('#', '')
                );

                if (existingIdx >= 0) {
                    customerOrders[existingIdx] = { ...customerOrders[existingIdx], ...order };
                } else {
                    customerOrders.unshift(order);
                    if (knownOrderIds) knownOrderIds.add(order.id);

                    // Se for para a empresa ativa, tocar som e exibir alerta de novo pedido
                    if (matchesActiveCompany) {
                        showNewOrderAlert(order);
                    }
                }

                // Atualizar vetor de empresas em memória
                companies.forEach(comp => {
                    if (comp.id === order.companyId) {
                        if (!comp.orders) comp.orders = [];
                        const cIdx = comp.orders.findIndex(o => String(o.id) === String(order.id) || String(o.id).replace('#', '') === String(order.id).replace('#', ''));
                        if (cIdx >= 0) comp.orders[cIdx] = { ...comp.orders[cIdx], ...order };
                        else comp.orders.unshift(order);
                    }
                });

                // Atualizar histórico de pedidos local
                try {
                    let allPlaced = JSON.parse(localStorage.getItem('all_placed_orders') || '[]');
                    const pIdx = allPlaced.findIndex(o => String(o.id) === String(order.id) || String(o.id).replace('#', '') === String(order.id).replace('#', ''));
                    if (pIdx >= 0) allPlaced[pIdx] = { ...allPlaced[pIdx], ...order };
                    else allPlaced.unshift(order);
                    localStorage.setItem('all_placed_orders', JSON.stringify(allPlaced));
                } catch(e) {}

            } else if (eventType === 'UPDATE') {
                let foundInList = false;
                customerOrders.forEach((o, idx) => {
                    if (String(o.id) === String(order.id) || String(o.id).replace('#', '') === String(order.id).replace('#', '')) {
                        customerOrders[idx] = { ...customerOrders[idx], ...order };
                        foundInList = true;
                    }
                });
                if (!foundInList && matchesActiveCompany) {
                    customerOrders.unshift(order);
                }

                companies.forEach(comp => {
                    if (comp.orders) {
                        comp.orders.forEach((o, idx) => {
                            if (String(o.id) === String(order.id) || String(o.id).replace('#', '') === String(order.id).replace('#', '')) {
                                comp.orders[idx] = { ...comp.orders[idx], ...order };
                            }
                        });
                    }
                });

                try {
                    let allPlaced = JSON.parse(localStorage.getItem('all_placed_orders') || '[]');
                    allPlaced.forEach((o, idx) => {
                        if (String(o.id) === String(order.id) || String(o.id).replace('#', '') === String(order.id).replace('#', '')) {
                            allPlaced[idx] = { ...allPlaced[idx], ...order };
                        }
                    });
                    localStorage.setItem('all_placed_orders', JSON.stringify(allPlaced));
                } catch(e) {}

                // Se o modal de detalhes do admin estiver aberto para este pedido, re-renderizar
                const modal = document.getElementById('adminOrderDetailModal');
                if (modal && modal.classList.contains('active')) {
                    const activeModalId = modal.getAttribute('data-order-id');
                    if (activeModalId && (String(activeModalId) === String(order.id) || String(activeModalId).replace('#', '') === String(order.id).replace('#', ''))) {
                        openAdminOrderDetailModal(order.id);
                    }
                }

            } else if (eventType === 'DELETE') {
                customerOrders = customerOrders.filter(o => 
                    String(o.id) !== String(order.id) && 
                    String(o.id).replace('#', '') !== String(order.id).replace('#', '')
                );
                companies.forEach(comp => {
                    if (comp.orders) {
                        comp.orders = comp.orders.filter(o => 
                            String(o.id) !== String(order.id) && 
                            String(o.id).replace('#', '') !== String(order.id).replace('#', '')
                        );
                    }
                });
                try {
                    let allPlaced = JSON.parse(localStorage.getItem('all_placed_orders') || '[]');
                    allPlaced = allPlaced.filter(o => 
                        String(o.id) !== String(order.id) && 
                        String(o.id).replace('#', '') !== String(order.id).replace('#', '')
                    );
                    localStorage.setItem('all_placed_orders', JSON.stringify(allPlaced));
                } catch(e) {}
            }

            saveData();

            // 1. Atualizar o painel da empresa (.admin-orders-scroll-container / #adminOrdersList)
            renderAdminOrdersList();

            // 2. Atualizar a visualização do cliente ('Meus Pedidos' / #customerOrdersList)
            renderCustomerOrdersList();
        }

        async function initSupabaseRealtimeOrders() {
            let supaUrl = '';
            let supaAnonKey = '';

            try {
                const res = await fetch('/api/supabase/config');
                if (res.ok) {
                    const cfg = await res.json();
                    supaUrl = (cfg.supabaseUrl || '').replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
                    supaAnonKey = cfg.supabaseAnonKey || '';
                }
            } catch(e) {}

            // 1. Configurar Supabase JS Client Realtime se as credenciais existirem
            if (window.supabase && typeof window.supabase.createClient === 'function' && supaUrl && supaAnonKey) {
                try {
                    if (supabaseRealtimeChannel) {
                        try { supabaseRealtimeChannel.unsubscribe(); } catch(e) {}
                    }

                    supabaseRealtimeClient = window.supabase.createClient(supaUrl, supaAnonKey, {
                        realtime: {
                            params: {
                                eventsPerSecond: 10
                            }
                        }
                    });

                    supabaseRealtimeChannel = supabaseRealtimeClient
                        .channel('orders-realtime-channel')
                        .on(
                            'postgres_changes',
                            { event: '*', schema: 'public', table: 'orders' },
                            (payload) => {
                                console.log('📡 [Supabase Postgres Realtime]', payload.eventType, payload.new || payload.old);
                                handleOrderRealtimeChange(payload.eventType, payload.new || payload.old);
                            }
                        )
                        .on(
                            'broadcast',
                            { event: 'order_event' },
                            (payload) => {
                                if (payload && payload.payload) {
                                    handleOrderRealtimeChange(payload.payload.eventType, payload.payload.data);
                                }
                            }
                        )
                        .subscribe((status) => {
                            console.log('⚡ [Supabase Realtime Orders Channel]:', status);
                        });
                } catch(supaErr) {
                    console.warn('ℹ️ Supabase Realtime channel:', supaErr.message);
                }
            }

            // 2. Conectar stream SSE como canal complementar em tempo real
            connectOrdersRealtimeStream();
        }

        let sseReconnectTimer = null;
        let sseFailures = 0;

        function connectOrdersRealtimeStream() {
            if (typeof EventSource === 'undefined') return;
            if (sseOrderStream) {
                try { sseOrderStream.close(); } catch(e) {}
            }

            try {
                const compId = activeCompanyId || 'company-demo-don';
                sseOrderStream = new EventSource(`/api/orders/stream?company_id=${encodeURIComponent(compId)}`);

                sseOrderStream.onopen = () => {
                    sseFailures = 0;
                };

                sseOrderStream.onmessage = (event) => {
                    try {
                        if (!event.data) return;
                        const msg = JSON.parse(event.data);
                        if (msg.eventType === 'CONNECTED') {
                            sseFailures = 0;
                            return;
                        }
                        if (msg.eventType && msg.data) {
                            handleOrderRealtimeChange(msg.eventType, msg.data);
                        }
                    } catch(err) {}
                };

                sseOrderStream.onerror = () => {
                    sseFailures++;
                    if (sseFailures > 2) {
                        try { sseOrderStream.close(); } catch(e) {}
                        if (!sseReconnectTimer) {
                            sseReconnectTimer = setTimeout(() => {
                                sseReconnectTimer = null;
                                connectOrdersRealtimeStream();
                            }, 30000);
                        }
                    }
                };
            } catch(e) {}
        }

        let orderFetchBackoffUntil = 0;
        let orderFetchFailures = 0;

        // Sincronização em tempo real de pedidos com o servidor central
        async function fetchOrdersFromServer(silent = true) {
            if (isFetchingOrders) return;
            const now = Date.now();
            if (now < orderFetchBackoffUntil) return;

            isFetchingOrders = true;
            try {
                const targetCompanyId = activeCompanyId || 'company-demo-don';
                const res = await fetch(`/api/orders?company_id=${encodeURIComponent(targetCompanyId)}`, {
                    headers: {
                        'x-company-id': targetCompanyId
                    }
                });
                if (!res.ok) {
                    orderFetchFailures++;
                    orderFetchBackoffUntil = Date.now() + Math.min(25000, 5000 * orderFetchFailures);
                    return;
                }
                const json = await res.json();
                orderFetchFailures = 0;
                orderFetchBackoffUntil = 0;

                if (json && json.success && Array.isArray(json.data)) {
                    const serverOrders = json.data;

                    // Detectar se há novos pedidos que chegaram no servidor
                    if (knownOrderIds.size > 0) {
                        const newArrivals = serverOrders.filter(o => !knownOrderIds.has(o.id));
                        if (newArrivals.length > 0) {
                            const top = newArrivals[0];
                            showNewOrderAlert(top);
                        }
                    }

                    // Atualizar conjunto de IDs conhecidos
                    knownOrderIds = new Set(serverOrders.map(o => o.id));

                    // Atualizar array em memória unindo pedidos locais com os do servidor
                    let mergedOrders = [...serverOrders];
                    customerOrders.forEach(localOrd => {
                        if (localOrd && localOrd.id && !mergedOrders.some(so => String(so.id) === String(localOrd.id))) {
                            if (!localOrd.companyId || localOrd.companyId === targetCompanyId) {
                                mergedOrders.push(localOrd);
                            }
                        }
                    });

                    const hasChanged = JSON.stringify(mergedOrders) !== JSON.stringify(customerOrders);
                    if (hasChanged) {
                        customerOrders = mergedOrders;
                        localStorage.setItem(`customerOrders_${targetCompanyId}`, JSON.stringify(customerOrders));
                        
                        // Atualizar vetor de empresas
                        let activeComp = companies.find(c => c.id === targetCompanyId);
                        if (activeComp) {
                            activeComp.orders = customerOrders;
                            localStorage.setItem('companies', JSON.stringify(companies));
                        }

                        renderAdminOrdersList();
                        renderCustomerOrdersList();
                    }
                }
            } catch (err) {
                orderFetchFailures++;
                orderFetchBackoffUntil = Date.now() + Math.min(25000, 5000 * orderFetchFailures);
                if (!silent) console.warn('Aviso sincronização pedidos:', err.message);
            } finally {
                isFetchingOrders = false;
            }
        }

        // Customizador de Açaí
        let activeCustomizingProduct = null;
        let selectedIngredients = [];

        // Controle do Clique Secreto de Desenvolvedor
        let devClickCounter = 0;
        let devClickTimer = null;

        // ========== ELEMENTOS DO DOM ==========
        const adminFab = document.getElementById('adminFab');
        const adminPanel = document.getElementById('adminPanel');
        const adminOverlay = document.getElementById('adminOverlay');
        const adminClose = document.getElementById('adminClose');
        const adminHint = document.getElementById('adminHint');
        
        const passwordModal = document.getElementById('passwordModal');
        const passwordForm = document.getElementById('passwordForm');
        const passwordInput = document.getElementById('passwordInput');
        const passwordError = document.getElementById('passwordError');
        const passwordCancel = document.getElementById('passwordCancel');
        
        const exportHtmlBtn = document.getElementById('exportHtmlBtn');
        const scheduleGrid = document.getElementById('scheduleGrid');
        
        const productModal = document.getElementById('productModal');
        const productForm = document.getElementById('productForm');
        const modalClose = document.getElementById('modalClose');
        const addProductBtn = document.getElementById('addProductBtn');
        
        const productsGrid = document.getElementById('productsGrid');
        const productAdminList = document.getElementById('productAdminList');
        
        const cartBtn = document.getElementById('cartBtn');
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        const cartClose = document.getElementById('cartClose');
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartFooter = document.getElementById('cartFooter');
        const cartSubtotal = document.getElementById('cartSubtotal');
        const cartTotal = document.getElementById('cartTotal');
        const cartDeliveryFee = document.getElementById('cartDeliveryFee');
        const btnCheckout = document.getElementById('btnCheckout');
        const btnClear = document.getElementById('btnClear');
        const customerFormContainer = document.getElementById('customerFormContainer');

        // ========== FUNÇÕES UTILITÁRIAS DE SLUGS, URLS E ROTEAMENTO MULTI-EMPRESA ==========
        function sanitizeSlug(text) {
            if (!text) return '';
            return text
                .toString()
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
                .substring(0, 50);
        }

        function generateSlug(text) {
            const clean = sanitizeSlug(text);
            return clean || ('loja-' + Date.now().toString(36));
        }

        function isCompanyDemo(comp) {
            if (!comp) return false;
            if (comp.id === 'company-demo-don' && (!comp.slug || comp.slug === 'demo') && (!comp.name || comp.name === 'Don Food')) return true;
            if (comp.slug === 'demo' && (!comp.name || comp.name === 'Don Food')) return true;
            if (comp.isDemo === true && (!comp.slug || comp.slug === 'demo') && (!comp.name || comp.name === 'Don Food')) return true;
            return false;
        }

        function getCompanySlug(comp) {
            if (!comp) return 'demo';
            if (isCompanyDemo(comp)) return 'demo';
            if (comp.slug && comp.slug !== 'demo') return sanitizeSlug(comp.slug);
            if (comp.name && comp.name !== 'Don Food') return generateSlug(comp.name);
            return comp.slug ? sanitizeSlug(comp.slug) : generateSlug(comp.name || comp.id);
        }

        function getCompanyOfficialUrl(comp) {
            const slug = getCompanySlug(comp);
            const origin = (typeof window !== 'undefined' && window.location && window.location.origin) 
                ? window.location.origin 
                : 'https://donfood.site';
            if (isCompanyDemo(comp) || slug === 'demo') {
                return `${origin}/?empresa=demo`;
            }
            return `${origin}/?empresa=${encodeURIComponent(slug)}`;
        }

        function getCompanyCurrentUrl(comp) {
            return getCompanyOfficialUrl(comp);
        }

        function extractRequestedCompanyIdentifier() {
            try {
                if (typeof window === 'undefined' || !window.location) return null;
                
                // 1. Query Params (?empresa=... / ?loja=... / ?c=... / ?slug=... / ?tenant=... / ?store=...)
                const urlParams = new URLSearchParams(window.location.search);
                let param = urlParams.get('empresa') || 
                            urlParams.get('loja') || 
                            urlParams.get('c') || 
                            urlParams.get('slug') || 
                            urlParams.get('tenant') || 
                            urlParams.get('store');
                
                if (param && param.trim()) return param.trim();

                // 2. Hash (#marmitas-fitnes / #/marmitas-fitnes / #empresa=marmitas-fitnes / #loja=marmitas-fitnes)
                const hash = window.location.hash || '';
                if (hash) {
                    const cleanHash = hash.replace(/^#\/?/, '').trim();
                    if (cleanHash.startsWith('empresa=')) {
                        return cleanHash.split('empresa=')[1].split('&')[0].trim();
                    } else if (cleanHash.startsWith('loja=')) {
                        return cleanHash.split('loja=')[1].split('&')[0].trim();
                    } else if (cleanHash && !['cardapio', 'inicio', 'loja-demo', 'login', 'carrinho', 'pedidos', 'admin', 'dev'].includes(cleanHash.toLowerCase())) {
                        return cleanHash;
                    }
                }

                // 3. Pathname (/marmitas-fitnes ou /loja/marmitas-fitnes ou /cardapio/marmitas-fitnes)
                const pathname = window.location.pathname || '';
                if (pathname && pathname !== '/' && pathname !== '/index.html') {
                    const parts = pathname.replace(/^\/+|\/+$/g, '').split('/');
                    let candidate = parts[0];
                    if (candidate === 'loja' || candidate === 'store' || candidate === 'empresa' || candidate === 'cardapio') {
                        candidate = parts[1] || '';
                    }
                    const systemPaths = ['api', 'login', 'dev', 'admin', 'pedidos', 'carrinho', 'assets', 'static', 'favicon.ico', 'styles.css', 'app.js', 'robots.txt', 'sitemap.xml'];
                    if (candidate && !systemPaths.includes(candidate.toLowerCase()) && !candidate.includes('.')) {
                        return candidate.trim();
                    }
                }
            } catch (e) {}
            return null;
        }

        function findCompanyInList(compList, identifier) {
            if (!identifier || !Array.isArray(compList) || compList.length === 0) return null;
            const clean = sanitizeSlug(identifier).toLowerCase();
            const rawLower = String(identifier).toLowerCase().trim();

            if (clean === 'demo' || rawLower === 'demo' || clean === 'donfood' || rawLower === 'don food') {
                return compList.find(c => c && (c.id === 'company-demo-don' || isCompanyDemo(c) || c.slug === 'demo')) || null;
            }

            // 1. Por slug exato ou slug sanitizado
            let found = compList.find(c => c && c.slug && (c.slug.toLowerCase() === rawLower || sanitizeSlug(c.slug).toLowerCase() === clean));
            if (found) return found;

            // 2. Por ID da empresa
            found = compList.find(c => c && c.id && (c.id.toLowerCase() === rawLower || c.id.toLowerCase() === clean));
            if (found) return found;

            // 3. Por aliases ou presetType (ex: hamburgueria, pizzaria, marmitas-fitnes, sorveteria, etc.)
            found = compList.find(c => {
                if (!c) return false;
                const cPreset = (c.presetType || '').toLowerCase().trim();
                const aliases = Array.isArray(c.aliases) ? c.aliases.map(a => sanitizeSlug(a).toLowerCase()) : [];
                return cPreset === clean || cPreset === rawLower || aliases.includes(clean) || aliases.includes(rawLower);
            });
            if (found) return found;

            // 4. Por Nome da empresa (slug do nome ou nome direto)
            found = compList.find(c => c && c.name && (sanitizeSlug(c.name).toLowerCase() === clean || c.name.toLowerCase().trim() === rawLower));
            if (found) return found;

            // 5. Por aproximação no nome ou slug se o termo tiver 3 ou mais caracteres
            if (clean.length >= 3) {
                found = compList.find(c => {
                    if (!c) return false;
                    const cSlug = sanitizeSlug(c.slug || '').toLowerCase();
                    const cNameSlug = sanitizeSlug(c.name || '').toLowerCase();
                    return (cSlug && (cSlug.includes(clean) || (cSlug.length >= 3 && clean.includes(cSlug)))) ||
                           (cNameSlug && (cNameSlug.includes(clean) || (cNameSlug.length >= 3 && clean.includes(cNameSlug))));
                });
                if (found) return found;
            }

            // 6. Por e-mail da empresa
            found = compList.find(c => c && c.email && c.email.toLowerCase().trim() === rawLower);
            if (found) return found;

            return null;
        }

        // ========== SINCRONIZAÇÃO E PERSISTÊNCIA CENTRALIZADA ==========
        let _syncCompaniesTimer = null;
        function debouncedSyncCompaniesToServer() {
            if (_syncCompaniesTimer) clearTimeout(_syncCompaniesTimer);
            _syncCompaniesTimer = setTimeout(() => {
                syncCompaniesToServer();
            }, 500);
        }

        async function syncCompaniesToServer() {
            try {
                const token = sessionStorage.getItem('devAuthToken') || sessionStorage.getItem('companyAuthToken');
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                await fetch('/api/companies', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ companies: companies })
                });
            } catch (err) {
                console.warn('[Sync] Sincronização de empresas em modo offline:', err);
            }
        }

        // ========== INICIALIZAÇÃO & BUSCA DE EMPRESAS ==========
        async function fetchCompaniesFromServer() {
            try {
                const requestedIdent = extractRequestedCompanyIdentifier();
                const res = await fetch('/api/companies');
                if (res.ok) {
                    const json = await res.json();
                    if (json && json.success && Array.isArray(json.data)) {
                        if (json.data.length > 0) {
                            const serverComps = json.data;
                            const compMap = new Map();
                            // Garantir demo padrão intacta
                            compMap.set(defaultDemoCompany.id, defaultDemoCompany);
                            // Adicionar empresas locais
                            (companies || []).forEach(c => {
                                if (c && c.id) {
                                    if (c.id === defaultDemoCompany.id) {
                                        compMap.set(c.id, { ...defaultDemoCompany, ...c, id: defaultDemoCompany.id, slug: 'demo', isDemo: true, name: 'Don Food' });
                                    } else {
                                        compMap.set(c.id, {
                                            ...c,
                                            isDemo: false,
                                            slug: c.slug ? sanitizeSlug(c.slug) : generateSlug(c.name || c.id)
                                        });
                                    }
                                }
                            });
                            // Mesclar com empresas retornadas pelo servidor
                            serverComps.forEach(sc => {
                                if (sc && sc.id) {
                                    if (sc.id === defaultDemoCompany.id) {
                                        const existing = compMap.get(sc.id) || {};
                                        compMap.set(sc.id, {
                                            ...defaultDemoCompany,
                                            ...existing,
                                            ...sc,
                                            id: defaultDemoCompany.id,
                                            slug: 'demo',
                                            isDemo: true,
                                            name: 'Don Food',
                                            adminPassword: existing.adminPassword || sc.adminPassword || 'admin123'
                                        });
                                    } else {
                                        const existing = compMap.get(sc.id) || {};
                                        compMap.set(sc.id, {
                                            ...existing,
                                            ...sc,
                                            isDemo: false,
                                            slug: sc.slug ? sanitizeSlug(sc.slug) : (existing.slug ? sanitizeSlug(existing.slug) : generateSlug(sc.name || sc.id)),
                                            adminPassword: existing.adminPassword || sc.adminPassword || 'admin123'
                                        });
                                    }
                                }
                            });
                            companies = Array.from(compMap.values());
                            localStorage.setItem('companies', JSON.stringify(companies));
                        } else if (companies && companies.length > 0) {
                            // Servidor vazio mas temos empresas locais - sincronizar
                            syncCompaniesToServer();
                        }
                    }
                }

                // Se havia uma empresa solicitada na URL e ainda não foi encontrada, buscar diretamente no endpoint de lookup
                if (requestedIdent) {
                    let target = findCompanyInList(companies, requestedIdent);
                    if (!target) {
                        try {
                            const lookupRes = await fetch(`/api/companies/lookup?q=${encodeURIComponent(requestedIdent)}`);
                            if (lookupRes.ok) {
                                const lookupJson = await lookupRes.json();
                                if (lookupJson && lookupJson.success && lookupJson.data) {
                                    const sc = lookupJson.data;
                                    target = sc;
                                    const idx = companies.findIndex(c => c.id === sc.id);
                                    if (idx >= 0) {
                                        companies[idx] = { ...companies[idx], ...sc };
                                    } else {
                                        companies.push(sc);
                                    }
                                    localStorage.setItem('companies', JSON.stringify(companies));
                                }
                            }
                        } catch (e) {}
                    }

                    if (target) {
                        activeCompanyId = target.id;
                        localStorage.setItem('activeCompanyId', activeCompanyId);
                        currentAppView = 'store';
                    }
                }

                loadData();
                renderAll();
                renderDevCompanyList();
            } catch (err) {
                console.warn('[Sync] Sincronização de empresas em modo offline:', err);
            }
        }

        async function init() {
            const requestedIdent = extractRequestedCompanyIdentifier();
            
            // Se houver parâmetro de loja na URL (ex: ?empresa=marmitas-fitnes), buscar do servidor primeiro para renderizar a loja correta de imediato
            if (requestedIdent) {
                await fetchCompaniesFromServer();
            } else {
                loadData();
            }

            loadPrinterSettings();
            if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
                isAdminLoggedIn = true;
            }
            renderAll();
            updateAdminHeaderUI();
            renderPresetCatalog();
            attachEventListeners();
            
            if (!requestedIdent) {
                // Sincronização em background se não havia loja específica na URL
                await fetchCompaniesFromServer();
            }
            
            // Buscar pedidos mais recentes no servidor central
            fetchOrdersFromServer(true);
            // Iniciar canal Supabase Realtime para a tabela orders
            initSupabaseRealtimeOrders();
            // Iniciar banner de consentimento LGPD
            initLgpdConsentBanner();

            // Verificação de rota direta para o Painel Dev (donfood.site/dev)
            checkDevUrlRoute();

            // Roteamento dinâmico via URL (permite troca sem recarregar tela inteira)
            window.addEventListener('popstate', () => {
                loadData();
                renderAll();
                checkDevUrlRoute();
            });
        }

        function checkDevUrlRoute() {
            const path = (window.location.pathname || '').toLowerCase();
            const urlParams = new URLSearchParams(window.location.search);
            const view = (urlParams.get('view') || urlParams.get('pagina') || '').toLowerCase();
            const hash = (window.location.hash || '').toLowerCase();
            const isDev = path === '/dev' || path === '/dev/' || path.startsWith('/dev/') || view === 'dev' || hash === '#dev';

            if (isDev) {
                setTimeout(() => {
                    if (AuthManager.isSuperAdmin()) {
                        openDevPanelModal();
                    } else {
                        openDevPasswordModal();
                    }
                }, 150);
            }
        }

        // ========== APLICADOR DESSA PALETA DE CORES DINÂMICA ==========
        function hexToRgb(hex) {
            if (!hex) return '220, 38, 38';
            hex = hex.replace('#', '');
            if (hex.length === 3) {
                hex = hex.split('').map(c => c + c).join('');
            }
            const num = parseInt(hex, 16);
            if (isNaN(num)) return '220, 38, 38';
            return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
        }

        function applyThemeColors(theme) {
            if (!theme) theme = THEME_PRESETS.acai;
            const primary = theme.primary || '#59176B';
            const primaryDark = theme.primaryDark || '#3E0C4C';
            const secondary = theme.secondary || '#8B26A0';
            const bgAccent = theme.bgAccent || '#FAF5FF';

            const root = document.documentElement;
            root.style.setProperty('--primary', primary);
            root.style.setProperty('--primary-dark', primaryDark);
            root.style.setProperty('--secondary', secondary);
            root.style.setProperty('--bg-accent', bgAccent);
            root.style.setProperty('--primary-rgb', hexToRgb(primary));
            root.style.setProperty('--secondary-rgb', hexToRgb(secondary));

            if (document.body) {
                document.body.style.setProperty('--primary', primary);
                document.body.style.setProperty('--primary-dark', primaryDark);
                document.body.style.setProperty('--secondary', secondary);
                document.body.style.setProperty('--bg-accent', bgAccent);
                document.body.style.setProperty('--primary-rgb', hexToRgb(primary));
                document.body.style.setProperty('--secondary-rgb', hexToRgb(secondary));
            }

            // Atualizar os inputs de cor no Admin se já estiverem renderizados
            const pInput = document.getElementById('themePrimaryColor');
            const pdInput = document.getElementById('themePrimaryDarkColor');
            const sInput = document.getElementById('themeSecondaryColor');
            const bgInput = document.getElementById('themeBgAccentColor');

            if (pInput) pInput.value = primary;
            if (pdInput) pdInput.value = primaryDark;
            if (sInput) sInput.value = secondary;
            if (bgInput) bgInput.value = bgAccent;

            const pHex = document.getElementById('themePrimaryHex');
            const pdHex = document.getElementById('themePrimaryDarkHex');
            const sHex = document.getElementById('themeSecondaryHex');
            const bgHex = document.getElementById('themeBgAccentHex');

            if (pHex) pHex.textContent = primary.toUpperCase();
            if (pdHex) pdHex.textContent = primaryDark.toUpperCase();
            if (sHex) sHex.textContent = secondary.toUpperCase();
            if (bgHex) bgHex.textContent = bgAccent.toUpperCase();

            if (typeof renderDynamicPromoBanner === 'function') renderDynamicPromoBanner();
            if (typeof renderDynamicIngredientsSection === 'function') renderDynamicIngredientsSection();
        }

        function updateCustomColorFromInput() {
            const primary = document.getElementById('themePrimaryColor').value;
            const primaryDark = document.getElementById('themePrimaryDarkColor').value;
            const secondary = document.getElementById('themeSecondaryColor').value;
            const bgAccent = document.getElementById('themeBgAccentColor').value;

            const customTheme = { primary, primaryDark, secondary, bgAccent };
            settings.themeColors = customTheme;

            let activeComp = companies.find(c => c.id === activeCompanyId);
            if (activeComp) {
                activeComp.themeColors = customTheme;
            }

            applyThemeColors(customTheme);
            saveData();
        }

        function applyPresetTheme(themeKey) {
            const preset = THEME_PRESETS[themeKey] || THEME_PRESETS.acai;
            settings.themeColors = { ...preset };

            let activeComp = companies.find(c => c.id === activeCompanyId);
            if (activeComp) {
                activeComp.themeColors = settings.themeColors;
            }

            applyThemeColors(settings.themeColors);
            renderAll();
            saveData();
            showNotification(`Tema "${preset.name || themeKey}" aplicado com sucesso! 🎨`, 'success');
        }

        // PROMO_PRESETS & EXTRAS_PRESETS CONFORME TEMA/CATEGORIA DA EMPRESA
        const PROMO_PRESETS = {
            acai: {
                badge: '⚡ ATENÇÃO! MONTE DO SEU JEITO ⚡',
                title: 'Na compra de qualquer Açaí, você tem direito a <span>3 INGREDIENTES GRÁTIS!</span>',
                subtitle: 'Sabor que conquista na primeira colherada! 💜',
                cards: [
                    { icon: '🍓', title: '1 FRUTA', desc: 'Morango, Banana, Kiwi, Manga' },
                    { icon: '🍫', title: '1 CALDA', desc: 'Chocolate, Leite Condensado' },
                    { icon: '🥣', title: '1 CEREAL', desc: 'Granola, Sucrilhos, Cereal Ball, Paçoca' }
                ],
                footerNote: '✨ <i>OU qualquer combinação de até 3 ingredientes da sua preferência! Ingredientes adicionais são cobrados à parte.</i>'
            },
            burguer: {
                badge: '🔥 COMBO IMPERDÍVEL! MONTE SEU BURGUER 🔥',
                title: 'Combine seu Hambúrguer Artesanal com <span>MOLHO ESPECIAL E BEBIDA GRÁTIS!</span>',
                subtitle: 'Carne 100% bovina no pão brioche bem seladinho! 🍔',
                cards: [
                    { icon: '🥓', title: 'ACOMPANHAMENTOS', desc: 'Bacon extra, Batata frita crocante' },
                    { icon: '🧀', title: 'QUEIJOS DERRETIDOS', desc: 'Cheddar cremoso, Catupiry, Prato' },
                    { icon: '🥤', title: 'MOLHOS DA CASA', desc: 'Maionese verde, Barbecue, Defumado' }
                ],
                footerNote: '✨ <i>Aproveite o combo especial da semana. Entrega rápida garantida na sua porta!</i>'
            },
            pizzaria: {
                badge: '🍕 FESTA DA PIZZA! BORDAS RECHEADAS 🍕',
                title: 'Na compra de 2 Pizzas Grandes, ganhe <span>1 BROTINHO DOCE GRÁTIS!</span>',
                subtitle: 'Massa crocante por fora e macia por dentro assada no capricho! 🍕',
                cards: [
                    { icon: '🧀', title: 'BORDA RECHEADA', desc: 'Catupiry original ou Cheddar cremoso' },
                    { icon: '🌶️', title: 'EXTRAS SALGADOS', desc: 'Calabresa extra, Bacon, Azeitonas' },
                    { icon: '🍫', title: 'OPÇÕES DOCES', desc: 'Nutella, Doce de Leite com Morango' }
                ],
                footerNote: '✨ <i>Pizzas quentinhas entregues em bag térmica higienizada. Monte já o seu pedido!</i>'
            },
            marmitaria: {
                badge: '🍱 MARMITAS EXECUTIVAS BEM SERVIDAS 🍱',
                title: 'Marmita saborosa com <span>SOBREMESA E SUCO NATURAL GRÁTIS!</span>',
                subtitle: 'Aquele tempero caseiro inconfundível para o seu almoço! 🥘',
                cards: [
                    { icon: '🥗', title: 'SALADAS FRESCAS', desc: 'Alface, Tomate, Vinagrete, Maionese' },
                    { icon: '🍳', title: 'ACOMPANHAMENTOS', desc: 'Ovo frito na hora, Farofa, Banana' },
                    { icon: '🥤', title: 'SUCOS NATURAIS', desc: 'Laranja, Limão, Maracujá geladinho' }
                ],
                footerNote: '✨ <i>Comida de mãe entregue rapidinho no seu trabalho ou residência!</i>'
            },
            sorveteria: {
                badge: '🍧 FESTIVAL DE GELADOS E TAÇAS 🍧',
                title: 'Monte seu Copo de Sorvete com <span>3 COBERTURAS GRÁTIS!</span>',
                subtitle: 'Refresque o seu dia com os melhores sabores artesanais! 🍨',
                cards: [
                    { icon: '🍓', title: 'FRUTAS FRESCAS', desc: 'Morango, Kiwi, Banana, Amora' },
                    { icon: '🍫', title: 'CALDAS DIVERSAS', desc: 'Caramelo, Chocolate, Morango' },
                    { icon: '🍬', title: 'CONFEITOS CROCANTES', desc: 'M&Ms, Bis, Confeti, Chocoball' }
                ],
                footerNote: '✨ <i>Refresque seu dia com o melhor sorvete da cidade!</i>'
            },
            confeitaria: {
                badge: '🍰 MOMENTO DOCE E ESPECIAL 🍰',
                title: 'Pedindo 3 Bolos de Pote, ganhe <span>1 CAIXINHA DE BRIGADEIROS!</span>',
                subtitle: 'Bolos de pote recheados e tortas finas gourmet! 🎂',
                cards: [
                    { icon: '🍫', title: 'NUTELLA & CHOCOLATE', desc: 'Ganache de chocolate 50%, Ninho' },
                    { icon: '🍓', title: 'FRUTAS SELECIONADAS', desc: 'Morangos frescos, Uvas sem semente' },
                    { icon: '🧁', title: 'DOCES FINOS', desc: 'Brigadeiros belgas, Beijinho, Bem-casado' }
                ],
                footerNote: '✨ <i>Doces artesanais feitos diariamente com produtos de altíssima qualidade.</i>'
            },
            fastfood: {
                badge: '🚀 FAST FOOD EXPRESS - O MAIS RÁPIDO 🚀',
                title: 'Combos Especiais com <span>BATATA CROCANTE E BEBIDA!</span>',
                subtitle: 'Sabor rápido e imbatível para matar sua fome! 🍟',
                cards: [
                    { icon: '🍟', title: 'BATATA CROCANTE', desc: 'Porção crocante com cheddar e bacon' },
                    { icon: '🌭', title: 'DOGS & BURGERS', desc: 'Hot dogs prensados e smash burgers' },
                    { icon: '🥤', title: 'REFRI GELADO', desc: 'Lata 350ml trincando de gelada' }
                ],
                footerNote: '✨ <i>Fome não espera! Peça pelo WhatsApp e receba em minutos.</i>'
            },
            darkgourmet: {
                badge: '👑 EXPERIÊNCIA GASTRONÔMICA PREMIUM 👑',
                title: 'Menu Degustação com <span>HARMONIZAÇÃO E ENTRADA CORTESIA!</span>',
                subtitle: 'Alta gastronomia no conforto do seu lar com embalagens térmicas de luxo. 🖤',
                cards: [
                    { icon: '🥩', title: 'CORTES NOBRES', desc: 'Picanha Angus, Ancho e Filé Mignon' },
                    { icon: '🍷', title: 'HARMONIZAÇÃO', desc: 'Vinhos selecionados e bebidas premium' },
                    { icon: '🍮', title: 'SOBREMESA NOBRE', desc: 'Petit Gâteau e Mousse de Maracujá' }
                ],
                footerNote: '✨ <i>Elegância e sabor sofisticado em cada detalhe do seu pedido.</i>'
            }
        };

        const EXTRAS_PRESETS = {
            acai: {
                badge: 'MAIS DE 18 INGREDIENTES',
                title: 'Monte a Combinação Perfeita!',
                desc: 'Confira todos os acompanhamentos e coberturas disponíveis para o seu açaí:',
                categories: [
                    {
                        name: '🍓 Frutas Frescas',
                        chips: [
                            { icon: '🍓', name: 'Morango' },
                            { icon: '🍌', name: 'Banana' },
                            { icon: '🥝', name: 'Kiwi' },
                            { icon: '🥭', name: 'Manga' }
                        ]
                    },
                    {
                        name: '🥣 Cereais & Crocantes',
                        chips: [
                            { icon: '🌾', name: 'Granola' },
                            { icon: '🌽', name: 'Sucrilhos de Milho' },
                            { icon: '⚽', name: 'Cereal Ball Mesclado' },
                            { icon: '⭕', name: 'Argolinha Cítricas' },
                            { icon: '🍫', name: 'Flocos Crocantes' },
                            { icon: '🥜', name: 'Castanha' },
                            { icon: '🥜', name: 'Paçoca' },
                            { icon: '🍬', name: "M&M's" },
                            { icon: '🌈', name: 'Granulado Colorido' },
                            { icon: '🍬', name: 'Jujuba' }
                        ]
                    },
                    {
                        name: '🍫 Caldas & Coberturas',
                        chips: [
                            { icon: '🍫', name: 'Nutella', price: '+R$ 4,00' },
                            { icon: '🥛', name: 'Leite Ninho', price: '+R$ 3,00' },
                            { icon: '🍫', name: 'Cobertura de Chocolate' },
                            { icon: '🍯', name: 'Leite Condensado' }
                        ]
                    }
                ]
            },
            burguer: {
                badge: 'MOLHOS & EXTRAS DA CASA',
                title: 'Turbine o Seu Hambúrguer!',
                desc: 'Escolha os adicionais e acompanhamentos artesanais mais pedidos:',
                categories: [
                    {
                        name: '🥓 Adicionais Crocantes & Queijos',
                        chips: [
                            { icon: '🥓', name: 'Bacon Crocante Extra', price: '+R$ 4,50' },
                            { icon: '🧀', name: 'Cheddar Cremoso Fatiado', price: '+R$ 3,50' },
                            { icon: '🧀', name: 'Catupiry Original', price: '+R$ 4,00' },
                            { icon: '🧅', name: 'Cebola Caramelizada', price: '+R$ 3,00' },
                            { icon: '🍳', name: 'Ovo Frito na Chapa', price: '+R$ 2,50' },
                            { icon: '🥒', name: 'Picles de Pepino Artesanal', price: '+R$ 2,00' }
                        ]
                    },
                    {
                        name: '🥫 Molhos Especiais da Casa',
                        chips: [
                            { icon: '🌿', name: 'Maionese Verde Temperada' },
                            { icon: '🔥', name: 'Molho Barbecue Defumado' },
                            { icon: '🌶️', name: 'Maionese de Pimenta Defumada' },
                            { icon: '🧄', name: 'Maionese de Alho Assado' }
                        ]
                    }
                ]
            },
            pizzaria: {
                badge: 'BORDAS & ADICIONAIS',
                title: 'Personalize Sua Pizza!',
                desc: 'Bordas recheadas e ingredientes extras para sua pizza ficar perfeita:',
                categories: [
                    {
                        name: '🧀 Bordas Recheadas Especiais',
                        chips: [
                            { icon: '🧀', name: 'Borda Recheada Catupiry', price: '+R$ 8,00' },
                            { icon: '🧀', name: 'Borda Recheada Cheddar', price: '+R$ 8,00' },
                            { icon: '🍫', name: 'Borda Doce de Nutella', price: '+R$ 10,00' }
                        ]
                    },
                    {
                        name: '🍕 Ingredientes Extras',
                        chips: [
                            { icon: '🥓', name: 'Bacon Crocante', price: '+R$ 5,00' },
                            { icon: '🍄', name: 'Cogumelos Champignon', price: '+R$ 6,00' },
                            { icon: '🫒', name: 'Azeitonas Pretas Extras', price: '+R$ 3,00' },
                            { icon: '🧀', name: 'Parmesão Ralado na Hora', price: '+R$ 4,00' }
                        ]
                    }
                ]
            },
            marmitaria: {
                badge: 'ACOMPANHAMENTOS CASEIROS',
                title: 'Complete a Sua Marmita!',
                desc: 'Adicione aquele toque especial com os melhores acompanhamentos da casa:',
                categories: [
                    {
                        name: '🍳 Adicionais e Acompanhamentos',
                        chips: [
                            { icon: '🍳', name: 'Ovo Frito de Gema Mole', price: '+R$ 2,50' },
                            { icon: '🍌', name: 'Banana Frita na Manteiga', price: '+R$ 3,00' },
                            { icon: '🥓', name: 'Farofa Crocante de Bacon', price: '+R$ 3,50' },
                            { icon: '🧀', name: 'Queijo Coalho Grelhado', price: '+R$ 4,00' },
                            { icon: '🍟', name: 'Porção Extra de Batata Frita', price: '+R$ 6,00' }
                        ]
                    }
                ]
            },
            sorveteria: {
                badge: 'CALDAS & COBERTURAS',
                title: 'Deixe Seu Sorvete Incrível!',
                desc: 'Adicione toppings e caldas artesanais para deixar seu sorvete no ponto:',
                categories: [
                    {
                        name: '🍨 Coberturas & Caldas',
                        chips: [
                            { icon: '🍫', name: 'Nutella Pura', price: '+R$ 4,00' },
                            { icon: '🥛', name: 'Leite Ninho Polvilhado', price: '+R$ 3,00' },
                            { icon: '🍓', name: 'Calda de Morango Artesanal' },
                            { icon: '🍯', name: 'Calda de Caramel Fudge' },
                            { icon: '🍫', name: 'Calda de Chocolate Quente' }
                        ]
                    }
                ]
            },
            confeitaria: {
                badge: 'RECHEIOS & COBERTURAS',
                title: 'Adoce o Seu Dia!',
                desc: 'Confira os recheios gourmet e coberturas dos nossos doces finos:',
                categories: [
                    {
                        name: '🧁 Recheios Especialíssimos',
                        chips: [
                            { icon: '🍫', name: 'Nutella Pura Belga', price: '+R$ 4,50' },
                            { icon: '🍓', name: 'Morangos Selecionados', price: '+R$ 3,50' },
                            { icon: '🥛', name: 'Creme Ninho Tradicional' },
                            { icon: '🥥', name: 'Beijinho de Coco Cremoso' }
                        ]
                    }
                ]
            },
            fastfood: {
                badge: 'EXTRAS CROCANTES',
                title: 'Combos & Turbinados!',
                desc: 'Acompanhamentos crocantes para deixar seu lanche ainda mais completo:',
                categories: [
                    {
                        name: '🍟 Acompanhamentos Crocantes',
                        chips: [
                            { icon: '🍟', name: 'Batata Frita P', price: '+R$ 8,00' },
                            { icon: '🧅', name: 'Onion Rings Crocantes (6un)', price: '+R$ 10,00' },
                            { icon: '🥓', name: 'Cheddar & Bacon na Batata', price: '+R$ 5,00' }
                        ]
                    }
                ]
            },
            darkgourmet: {
                badge: 'SELEÇÃO DE ACOMPANHAMENTOS NOBRES',
                title: 'Toques Gastronômicos Exclusivos',
                desc: 'Acompanhamentos artesanais e molhos refinados para o seu prato:',
                categories: [
                    {
                        name: '🥩 Molhos & Guarnições Nobles',
                        chips: [
                            { icon: '🍷', name: 'Redução de Vinho Rótulo Ouro', price: '+R$ 8,00' },
                            { icon: '🍄', name: 'Risoto de Cogumelos Trufados', price: '+R$ 12,00' },
                            { icon: '🧀', name: 'Aligot de Queijo da Canastra', price: '+R$ 10,00' }
                        ]
                    }
                ]
            }
        };

        // Helper para obter a empresa ativa no sistema
        function getActiveCompany() {
            if (companies && companies.length > 0) {
                const found = companies.find(c => c.id === activeCompanyId);
                if (found) return found;
                return companies[0];
            }
            return {
                id: activeCompanyId || 'company-demo-don',
                name: (settings && settings.restaurantName) || 'Don Food',
                slug: (settings && settings.slug) || 'demo',
                presetType: (settings && settings.presetType) || 'burguer',
                email: (settings && settings.email) || 'demo@donfood.com',
                whatsappNumber: (settings && settings.whatsappNumber) || '5521999999999'
            };
        }

        // Helper para obter a categoria atual da empresa
        function getActiveCompanyPresetType() {
            if (settings && settings.presetType) return settings.presetType;
            const activeComp = getActiveCompany();
            if (activeComp && activeComp.presetType) return activeComp.presetType;
            return 'acai';
        }

        // Renderizadores Dinâmicos das Seções Personalizadas
        let promoCarouselInterval = null;
        let promoCarouselCurrentIndex = 0;
        let promoOriginalCount = 0;

        function renderDynamicPromoBanner() {
            const bannerEl = document.getElementById('dynamicPromoBanner');
            if (!bannerEl) return;

            // Limpar timer existente
            if (promoCarouselInterval) {
                clearInterval(promoCarouselInterval);
                promoCarouselInterval = null;
            }

            const presetKey = getActiveCompanyPresetType();
            const defaultData = PROMO_PRESETS[presetKey] || PROMO_PRESETS.acai;
            const bannerData = settings.customBanner || defaultData;

            if (bannerData.enabled === false) {
                bannerEl.style.display = 'none';
                return;
            } else {
                bannerEl.style.display = 'block';
            }

            const badge = bannerData.badge !== undefined && bannerData.badge !== '' ? bannerData.badge : defaultData.badge;
            const title = bannerData.title !== undefined && bannerData.title !== '' ? bannerData.title : defaultData.title;
            const subtitle = bannerData.subtitle !== undefined && bannerData.subtitle !== '' ? bannerData.subtitle : defaultData.subtitle;
            const footerNote = bannerData.footerNote !== undefined && bannerData.footerNote !== '' ? bannerData.footerNote : defaultData.footerNote;
            const cards = (bannerData.cards && bannerData.cards.length > 0) ? bannerData.cards : defaultData.cards;
            promoOriginalCount = cards.length;

            // Duplicar cards para loop contínuo infinito
            const renderCards = [...cards, ...cards, ...cards];

            bannerEl.innerHTML = `
                <div class="promo-header">
                    ${badge ? `<span class="promo-badge">${badge}</span>` : ''}
                    ${title ? `<div class="promo-title-box"><h2 class="promo-title">${title}</h2></div>` : ''}
                    ${subtitle ? `<p class="promo-subtitle" style="color: #111827; font-weight: 800; font-size: 1.05rem; margin-top: 0.5rem; text-shadow: none;">${subtitle}</p>` : ''}
                </div>

                <div class="promo-carousel-wrapper" id="promoCarouselWrapper">
                    <div class="promo-options" id="promoOptionsTrack">
                        ${renderCards.map((card, idx) => {
                            const originalIdx = idx % cards.length;
                            return `
                                <div class="promo-option-card ${originalIdx === 0 ? 'highlight' : ''}" data-original-index="${originalIdx}" data-index="${idx}">
                                    <div class="promo-option-icon">${card.icon || ''}</div>
                                    <div class="promo-option-title">${card.title || ''}</div>
                                    <small style="color: #374151; font-weight: 600;">${card.desc || ''}</small>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="promo-carousel-dots" id="promoCarouselDots">
                        ${cards.map((_, idx) => `
                            <button type="button" class="promo-carousel-dot ${idx === 0 ? 'active' : ''}" onclick="goToPromoSlide(${idx})" title="Opção ${idx + 1}" aria-label="Opção ${idx + 1}"></button>
                        `).join('')}
                    </div>
                </div>

                ${footerNote ? `<p class="promo-subtitle-combo">${footerNote}</p>` : ''}
            `;

            initPromoCarousel(cards.length);
        }

        function initPromoCarousel(totalCards) {
            if (totalCards <= 1) return;
            // Começa no conjunto do meio para permitir rotação infinita suave
            promoCarouselCurrentIndex = totalCards;
            updatePromoSlidePosition(promoCarouselCurrentIndex, false);

            startPromoCarouselAutoPlay(totalCards);

            // Pausa carrossel se o usuário estiver passando o mouse ou interagindo
            const wrapper = document.getElementById('promoCarouselWrapper');
            if (wrapper) {
                wrapper.addEventListener('mouseenter', stopPromoCarouselAutoPlay);
                wrapper.addEventListener('mouseleave', () => startPromoCarouselAutoPlay(totalCards));
                wrapper.addEventListener('touchstart', stopPromoCarouselAutoPlay, { passive: true });
                wrapper.addEventListener('touchend', () => {
                    setTimeout(() => startPromoCarouselAutoPlay(totalCards), 1200);
                });
            }

            window.addEventListener('resize', () => {
                updatePromoSlidePosition(promoCarouselCurrentIndex, false);
            }, { passive: true });
        }

        function startPromoCarouselAutoPlay(totalCards) {
            if (promoCarouselInterval) clearInterval(promoCarouselInterval);
            promoCarouselInterval = setInterval(() => {
                nextPromoSlide(totalCards);
            }, 3000);
        }

        function stopPromoCarouselAutoPlay() {
            if (promoCarouselInterval) {
                clearInterval(promoCarouselInterval);
                promoCarouselInterval = null;
            }
        }

        function nextPromoSlide(totalCards) {
            promoCarouselCurrentIndex++;
            updatePromoSlidePosition(promoCarouselCurrentIndex, true);

            // Reseta a posição de forma transparente no exato momento em que a animação termina (350ms)
            if (promoCarouselCurrentIndex >= totalCards * 2) {
                setTimeout(() => {
                    promoCarouselCurrentIndex = totalCards;
                    updatePromoSlidePosition(promoCarouselCurrentIndex, false);
                }, 350);
            }
        }

        function goToPromoSlide(origIndex) {
            if (promoOriginalCount <= 0) return;
            promoCarouselCurrentIndex = promoOriginalCount + origIndex;
            updatePromoSlidePosition(promoCarouselCurrentIndex, true);
        }

        function updatePromoSlidePosition(index, animate = true) {
            const track = document.getElementById('promoOptionsTrack');
            const wrapper = document.getElementById('promoCarouselWrapper');
            const dots = document.querySelectorAll('.promo-carousel-dot');
            const cards = document.querySelectorAll('.promo-option-card');

            if (!track || !cards.length) return;

            const origIndex = index % (promoOriginalCount || 1);

            const cardEl = cards[0];
            const cardWidth = cardEl ? cardEl.offsetWidth : (window.innerWidth <= 768 ? 160 : 200);
            const gap = window.innerWidth <= 768 ? 10.4 : 16; // 0.65rem ou 1rem
            const wrapperWidth = wrapper ? wrapper.offsetWidth : window.innerWidth;
            
            // Centraliza o card ativo no container tanto em desktop quanto em mobile
            const centerPadding = (wrapperWidth - cardWidth) / 2;
            const offset = (index * (cardWidth + gap)) - centerPadding;

            track.style.transition = animate ? 'transform 0.35s ease-out' : 'none';
            track.style.transform = `translateX(-${offset}px)`;

            // Destacar o card ativo e o ponto indicador
            cards.forEach((card, i) => {
                if (i === index) {
                    card.classList.add('highlight');
                } else {
                    card.classList.remove('highlight');
                }
            });

            dots.forEach((dot, i) => {
                if (i === origIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // ========== SEÇÃO DE ACOMPANHAMENTOS DINÂMICOS COM MÚLTIPLAS CATEGORIAS ==========
        let currentAdminExtrasCategories = [];

        function renderDynamicIngredientsSection() {
            const sectionEl = document.getElementById('dynamicIngredientsSection');
            if (!sectionEl) return;

            const presetKey = getActiveCompanyPresetType();
            const defaultData = EXTRAS_PRESETS[presetKey] || EXTRAS_PRESETS.acai;
            const extrasData = settings.customExtras || defaultData;

            if (extrasData.enabled === false) {
                sectionEl.style.display = 'none';
                return;
            } else {
                sectionEl.style.display = 'block';
            }

            const badge = extrasData.badge !== undefined && extrasData.badge !== '' ? extrasData.badge : defaultData.badge;
            const title = extrasData.title !== undefined && extrasData.title !== '' ? extrasData.title : defaultData.title;
            const desc = extrasData.desc !== undefined && extrasData.desc !== '' ? extrasData.desc : defaultData.desc;

            let categoriesList = [];

            if (Array.isArray(extrasData.categories) && extrasData.categories.length > 0) {
                categoriesList = extrasData.categories;
            } else if (Array.isArray(extrasData.chips)) {
                categoriesList = [{
                    name: extrasData.categoryName || (defaultData.categories && defaultData.categories[0] ? defaultData.categories[0].name : 'Acompanhamentos'),
                    chips: extrasData.chips
                }];
            } else if (Array.isArray(defaultData.categories)) {
                categoriesList = defaultData.categories;
            }

            const categoriesContent = DefensiveUtils.safeArray(categoriesList).map(cat => {
                if (!cat) return '';
                const chips = DefensiveUtils.safeArray(cat.chips);
                return `
                <div style="margin-bottom: 2rem;">
                    ${cat.name ? `<div class="ingredients-category-title">${DefensiveUtils.escapeHtml(cat.name)}</div>` : ''}
                    <div class="ingredients-grid">
                        ${chips.map(chip => {
                            if (!chip) return '';
                            const icon = DefensiveUtils.escapeHtml(chip.icon || '✨');
                            const name = DefensiveUtils.escapeHtml(chip.name || '');
                            const price = chip.price ? `<span class="ingredient-chip-price">${DefensiveUtils.escapeHtml(chip.price)}</span>` : '';
                            return `
                            <div class="ingredient-chip">
                                <span>${icon}</span> ${name}
                                ${price}
                            </div>
                        `;
                        }).join('')}
                    </div>
                </div>
            `;
            }).join('');

            sectionEl.innerHTML = `
                <div style="text-align: center; margin-bottom: 2rem;">
                    ${badge ? `<span style="background: var(--primary); color: var(--white); font-weight: 800; padding: 0.4rem 1.2rem; border-radius: 30px; font-size: 0.85rem; display: inline-block; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">${DefensiveUtils.escapeHtml(badge)}</span>` : ''}
                    ${title ? `<h3 style="font-size: 1.6rem; color: var(--primary-dark); font-weight: 800; margin-top: 0.5rem;">${DefensiveUtils.escapeHtml(title)}</h3>` : ''}
                    ${desc ? `<p style="color: var(--gray-600); max-width: 600px; margin: 0.5rem auto 0; font-size: 0.95rem;">${DefensiveUtils.escapeHtml(desc)}</p>` : ''}
                </div>
                ${categoriesContent}
            `;
        }

        function updateMenuSubtitle() {
            const subEl = document.getElementById('menuSubtitle');
            if (!subEl) return;
            subEl.innerHTML = 'Escolha suas opções favoritas e faça seu pedido com rapidez e praticidade!';
        }

        const CATEGORY_PROFILES = {
            acai: {
                name: 'Açaí Tropical & Sorvetes',
                subtitle: 'Sabor que conquista na primeira colherada! Monte do seu jeito.',
                deliveryTime: '30 - 45 min',
                deliveryFee: 5.00
            },
            burguer: {
                name: 'HB Hamburgueria Artesanal',
                subtitle: 'Hambúrgueres artesanais 100% carne bovina, smashs e porções crocantes!',
                deliveryTime: '30 - 40 min',
                deliveryFee: 6.00
            },
            pizzaria: {
                name: 'Pizzaria & Massas Artesanais',
                subtitle: 'Pizzas quentinhas com borda recheada, assadas no forno e massa crocante!',
                deliveryTime: '35 - 50 min',
                deliveryFee: 7.00
            },
            marmitaria: {
                name: 'Marmitaria & Comida Caseira',
                subtitle: 'Marmitas executivas bem servidas com aquele tempero caseiro inconfundível!',
                deliveryTime: '25 - 40 min',
                deliveryFee: 5.00
            },
            sorveteria: {
                name: 'Sorveteria & Açaí Gelados',
                subtitle: 'Sorvetes artesanais cremosos, taças generosas e sobremesas refrescantes!',
                deliveryTime: '20 - 35 min',
                deliveryFee: 5.00
            },
            confeitaria: {
                name: 'Confeitaria & Bolos Finos',
                subtitle: 'Bolos no pote, tortas recheadas e doces gourmet feitos com muito carinho!',
                deliveryTime: '25 - 40 min',
                deliveryFee: 6.00
            },
            fastfood: {
                name: 'Fast Food & Lanches Express',
                subtitle: 'Lanches rápidos, porções crocantes e combos deliciosos entregues em minutos!',
                deliveryTime: '20 - 30 min',
                deliveryFee: 6.00
            },
            darkgourmet: {
                name: 'Gourmet Gold Gastronomia',
                subtitle: 'Alta gastronomia e cortes nobres no conforto da sua residência.',
                deliveryTime: '35 - 50 min',
                deliveryFee: 8.00
            }
        };

        function updateCompanyCategory(presetKey) {
            if (!presetKey) return;
            const profile = CATEGORY_PROFILES[presetKey] || CATEGORY_PROFILES.acai;
            const presetColor = THEME_PRESETS[presetKey] || THEME_PRESETS.acai;

            settings.presetType = presetKey;
            settings.themeColors = { ...presetColor };
            settings.restaurantName = profile.name;
            settings.subtitle = profile.subtitle;
            settings.deliveryTime = profile.deliveryTime || '30 - 45 min';
            if (profile.deliveryFee !== undefined) {
                settings.deliveryFee = profile.deliveryFee;
            }

            // Atualizar catálogo completo de produtos para o novo ramo de atuação
            const template = (typeof PRESET_CATALOGS_BY_CATEGORY !== 'undefined' && PRESET_CATALOGS_BY_CATEGORY[presetKey])
                || (typeof MENU_PRESETS !== 'undefined' && MENU_PRESETS[presetKey])
                || (typeof PRESET_CATALOGS_BY_CATEGORY !== 'undefined' ? PRESET_CATALOGS_BY_CATEGORY.acai : defaultProducts);

            products = template.map((item, idx) => ({
                id: (Date.now() + idx),
                name: item.name,
                tag: item.tag || '',
                description: item.description || '',
                price: DefensiveUtils.safeNumber(item.price, 10),
                image: item.image,
                available: item.available !== false,
                isCustomizable: item.isCustomizable !== undefined ? item.isCustomizable : (item.isAcai !== undefined ? item.isAcai : true)
            }));

            // Resetar banners customizados e acompanhamentos para carregar os padrões da nova categoria
            settings.customBanner = null;
            settings.customExtras = null;

            let activeComp = (typeof companies !== 'undefined' && Array.isArray(companies) && companies.find(c => c.id === activeCompanyId)) || (typeof getActiveCompany === 'function' ? getActiveCompany() : null);
            if (activeComp) {
                activeComp.name = settings.restaurantName;
                activeComp.subtitle = settings.subtitle;
                activeComp.presetType = presetKey;
                activeComp.deliveryTime = settings.deliveryTime;
                activeComp.deliveryFee = settings.deliveryFee;
                activeComp.themeColors = { ...settings.themeColors };
                activeComp.customBanner = null;
                activeComp.customExtras = null;
                activeComp.products = products;
            }

            // Atualizar campos do formulário no Admin imediatamente
            const nameInput = document.getElementById('restaurantName');
            if (nameInput) nameInput.value = settings.restaurantName;
            const subInput = document.getElementById('restaurantSubtitle');
            if (subInput) subInput.value = settings.subtitle;
            const timeInput = document.getElementById('deliveryTime');
            if (timeInput) timeInput.value = settings.deliveryTime;
            const feeInput = document.getElementById('deliveryFee');
            if (feeInput) feeInput.value = settings.deliveryFee;
            const catSelect = document.getElementById('companyCategorySelect');
            if (catSelect && catSelect.value !== presetKey) catSelect.value = presetKey;

            applyThemeColors(settings.themeColors);
            renderAll();
            saveData();
            showNotification(`Sistema e cardápio completamente atualizados para "${profile.name}"! 🚀🎨`, 'success');
        }
        window.updateCompanyCategory = updateCompanyCategory;

        function copyActiveCompanyOfficialLink() {
            const activeComp = (typeof getActiveCompany === 'function' ? getActiveCompany() : null) 
                || (typeof companies !== 'undefined' && companies.find(c => c.id === activeCompanyId)) 
                || settings;
            const slugInput = document.getElementById('restaurantSlug');
            const customSlug = slugInput ? sanitizeSlug(slugInput.value) : '';
            const nameInput = document.getElementById('restaurantName');
            const currentName = (nameInput && nameInput.value.trim()) || (settings && settings.restaurantName) || (activeComp && activeComp.name) || 'Sua Loja';
            const isPureDemo = isCompanyDemo(activeComp) && !customSlug && (currentName === 'Don Food' || !currentName);
            const slugVal = isPureDemo 
                ? 'demo' 
                : (customSlug || (activeComp && activeComp.slug && activeComp.slug !== 'demo' ? sanitizeSlug(activeComp.slug) : '') || (settings && settings.slug && settings.slug !== 'demo' ? sanitizeSlug(settings.slug) : '') || (currentName !== 'Don Food' ? generateSlug(currentName) : 'demo'));
            
            const origin = (typeof window !== 'undefined' && window.location && window.location.origin) 
                ? window.location.origin 
                : 'https://donfood.site';
            const url = `${origin}/?empresa=${encodeURIComponent(slugVal)}`;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(() => {
                    showNotification(`Link oficial copiado: ${url} 📋`, 'success');
                }).catch(() => {
                    prompt('Copie o link oficial do seu cardápio:', url);
                });
            } else {
                prompt('Copie o link oficial do seu cardápio:', url);
            }
        }

        function shareActiveCompanyWhatsApp() {
            const activeComp = (typeof getActiveCompany === 'function' ? getActiveCompany() : null) 
                || (typeof companies !== 'undefined' && companies.find(c => c.id === activeCompanyId)) 
                || settings;
            const slugInput = document.getElementById('restaurantSlug');
            const customSlug = slugInput ? sanitizeSlug(slugInput.value) : '';
            const nameInput = document.getElementById('restaurantName');
            const currentName = (nameInput && nameInput.value.trim()) || (settings && settings.restaurantName) || (activeComp && activeComp.name) || 'Sua Loja';
            const isPureDemo = isCompanyDemo(activeComp) && !customSlug && (currentName === 'Don Food' || !currentName);
            const slugVal = isPureDemo 
                ? 'demo' 
                : (customSlug || (activeComp && activeComp.slug && activeComp.slug !== 'demo' ? sanitizeSlug(activeComp.slug) : '') || (settings && settings.slug && settings.slug !== 'demo' ? sanitizeSlug(settings.slug) : '') || (currentName !== 'Don Food' ? generateSlug(currentName) : 'demo'));
            
            const origin = (typeof window !== 'undefined' && window.location && window.location.origin) 
                ? window.location.origin 
                : 'https://donfood.site';
            const url = `${origin}/?empresa=${encodeURIComponent(slugVal)}`;
            const name = currentName || (activeComp && activeComp.name) || settings.restaurantName || 'Don Food';
            const text = encodeURIComponent(`Olá! Confira nosso cardápio digital completo e faça seu pedido online no *${name}* através do link oficial:\n${url}`);
            window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
        }

        function copyCompanyLink(slugOrId) {
            const comp = (typeof companies !== 'undefined' && companies.find(c => c.slug === slugOrId || c.id === slugOrId || getCompanySlug(c) === slugOrId)) || { slug: slugOrId };
            const url = getCompanyOfficialUrl(comp);
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(() => {
                    showNotification(`Link oficial copiado: ${url} 📋`, 'success');
                }).catch(() => {
                    prompt('Copie o link oficial:', url);
                });
            } else {
                prompt('Copie o link oficial:', url);
            }
        }

        function handleSlugSanitize(inputEl) {
            if (!inputEl) return;
            const clean = sanitizeSlug(inputEl.value);
            inputEl.value = clean;
        }

        function handleAdminNameSlugSync(inputEl) {
            const slugInput = document.getElementById('restaurantSlug');
            if (slugInput && !slugInput.dataset.manualEdit) {
                slugInput.value = generateSlug(inputEl.value);
                updateAdminShareLinkDisplay();
            }
        }

        function handleAdminSlugInput(inputEl) {
            if (!inputEl) return;
            inputEl.dataset.manualEdit = 'true';
            inputEl.value = sanitizeSlug(inputEl.value);
            updateAdminShareLinkDisplay();
        }

        function handleDevNewNameSlugSync(inputEl) {
            const slugInput = document.getElementById('devNewCompSlug');
            if (slugInput && !slugInput.dataset.manualEdit) {
                slugInput.value = generateSlug(inputEl.value);
            }
        }

        function updateAdminShareLinkDisplay() {
            const activeComp = (typeof getActiveCompany === 'function' ? getActiveCompany() : null) 
                || (typeof companies !== 'undefined' && companies.find(c => c.id === activeCompanyId)) 
                || settings;
            const slugInput = document.getElementById('restaurantSlug');
            const customSlug = slugInput ? sanitizeSlug(slugInput.value) : '';
            const nameInput = document.getElementById('restaurantName');
            const currentName = (nameInput && nameInput.value.trim()) 
                || (settings && settings.restaurantName) 
                || (activeComp && activeComp.name) 
                || 'Sua Loja';

            const isPureDemo = isCompanyDemo(activeComp) && !customSlug && (currentName === 'Don Food' || !currentName);
            const slugVal = isPureDemo 
                ? 'demo' 
                : (customSlug || (activeComp && activeComp.slug && activeComp.slug !== 'demo' ? sanitizeSlug(activeComp.slug) : '') || (settings && settings.slug && settings.slug !== 'demo' ? sanitizeSlug(settings.slug) : '') || (currentName !== 'Don Food' ? generateSlug(currentName) : 'demo'));
            
            const origin = (typeof window !== 'undefined' && window.location && window.location.origin) 
                ? window.location.origin 
                : 'https://donfood.site';
            const host = (typeof window !== 'undefined' && window.location && window.location.host) 
                ? window.location.host 
                : 'donfood.site';
            
            const fullUrl = `${origin}/?empresa=${encodeURIComponent(slugVal)}`;
            const displayBadge = `${host}/?empresa=${slugVal}`;
            
            const urlText = document.getElementById('adminCompanyShareUrlText');
            const slugBadge = document.getElementById('adminCompanySlugBadge');
            const openBtn = document.getElementById('adminCompanyOpenLinkBtn');
            const slugPrefix = document.getElementById('adminSlugPrefix');
            
            if (urlText) urlText.textContent = fullUrl;
            if (slugBadge) slugBadge.textContent = displayBadge;
            if (slugPrefix) slugPrefix.textContent = `${host}/?empresa=`;
            if (openBtn) {
                openBtn.href = fullUrl;
                openBtn.target = '_blank';
            }

            // Exibir a Logo no Link Oficial quando incluída
            const logoInput = document.getElementById('logoUrl');
            const currentLogo = (logoInput && logoInput.value && logoInput.value.trim()) 
                || (settings && settings.logoUrl) 
                || (activeComp && activeComp.logoUrl) 
                || '';
            const logoImg = document.getElementById('adminCompanyLinkLogo');
            const logoFallback = document.getElementById('adminCompanyLinkLogoFallback');
            const logoMini = document.getElementById('adminCompanyShareUrlLogoMini');
            const storeNameEl = document.getElementById('adminCompanyLinkStoreName');
            const catBadge = document.getElementById('adminCompanyLinkCategoryBadge');
            
            if (storeNameEl) {
                storeNameEl.textContent = currentName;
            }

            if (catBadge) {
                const catType = (typeof getActiveCompanyPresetType === 'function' ? getActiveCompanyPresetType() : '') || (activeComp && activeComp.presetType) || '';
                const catMap = {
                    marmitaria: '🍱 Marmitaria Caseira & Refeições',
                    burguer: '🍔 Hamburgueria & Lanches',
                    acai: '🍧 Açaí & Sobremesas',
                    pizzaria: '🍕 Pizzaria Artesanal',
                    sorveteria: '🍨 Sorveteria & Gelateria',
                    confeitaria: '🍰 Confeitaria & Doceria',
                    pastelaria: '🥟 Pastelaria & Salgados',
                    sushi: '🍣 Culinária Japonesa & Sushi',
                    bebidas: '🍺 Distribuidora & Bebidas',
                    padaria: '🥖 Padaria & Cafeteria',
                    hortifruti: '🍎 Hortifrúti & Mercado',
                    petshop: '🐾 Pet Shop & Ração',
                    farmacia: '💊 Drogaria & Farmácia'
                };
                catBadge.textContent = catMap[catType] || 'Link direto para pedidos e cardápio online';
            }

            if (currentLogo && currentLogo.trim() !== '') {
                if (logoImg) {
                    logoImg.src = currentLogo;
                    logoImg.style.display = 'block';
                    logoImg.onerror = function() {
                        this.style.display = 'none';
                        if (logoFallback) logoFallback.style.display = 'block';
                        if (logoMini) logoMini.style.display = 'none';
                    };
                }
                if (logoFallback) logoFallback.style.display = 'none';
                if (logoMini) {
                    logoMini.src = currentLogo;
                    logoMini.style.display = 'inline-block';
                    logoMini.onerror = function() {
                        this.style.display = 'none';
                    };
                }
            } else {
                if (logoImg) logoImg.style.display = 'none';
                if (logoFallback) logoFallback.style.display = 'block';
                if (logoMini) logoMini.style.display = 'none';
            }

            // Atualizar QR Code Oficial
            const qrImg = document.getElementById('adminCompanyQrImg');
            if (qrImg) {
                const qrEndpoint = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(fullUrl)}&margin=10`;
                qrImg.src = qrEndpoint;
            }
        }
        window.updateAdminShareLinkDisplay = updateAdminShareLinkDisplay;

        // ========== ARQUITETURA MULTI-EMPRESA UNIVERSAL & ISOLAMENTO DE BANCO DE DADOS ==========
        const defaultDemoCompany = {
            id: 'company-demo-don',
            slug: 'demo',
            aliases: ['acai', 'donfood', 'don-food', 'acaiteria'],
            isDemo: true,
            name: 'Don Food',
            email: 'demo@donfood.com',
            subtitle: 'Cardápio Digital & Delivery Oficial! Faça seu pedido teste e monte do seu jeito.',
            whatsappNumber: '5521999999999',
            instagram: '@donfood.com',
            cnpj: '00.000.000/0001-99',
            address: 'Av. Brasil, 500 - Loja Modelo',
            logoUrl: 'Logo_Don.png',
            adminPassword: 'admin',
            deliveryFee: 5.00,
            deliveryTime: '25 - 40 min',
            presetType: 'burguer',
            themeColors: {
                primary: '#DC2626',
                primaryDark: '#991B1B',
                secondary: '#EA580C',
                bgAccent: '#FFFDF7'
            },
            coupons: [
                { code: 'DON10', discount: 10, type: 'percent', minOrder: 30, active: true },
                { code: 'BEMVINDO', discount: 5, type: 'fixed', minOrder: 20, active: true },
                { code: 'FRETEGRATIS', discount: 5, type: 'fixed', minOrder: 40, active: true }
            ],
            products: [
                {
                    id: 101,
                    name: '🍔 Don Smash Burger Bacon Duplo',
                    tag: '🔥 HAMBURGUERIA',
                    description: 'Pão brioche tostado, 2x smash burger artesanal 90g com crostinha crocante, cheddar duplo derretido, bacon fatiado e maionese secreta da casa.',
                    price: 28.90,
                    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&fit=crop',
                    available: true,
                    isAcai: false,
                    isCustomizable: true
                },
                {
                    id: 201,
                    name: '🍕 Pizza Calabresa Artesanal Especial',
                    tag: '🍕 PIZZARIA',
                    description: 'Massa artesanal italiana de longa fermentação, molho pelati fresco, calabresa selecionada fatiada, muçarela derretida, cebola roxa e orégano.',
                    price: 45.00,
                    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&fit=crop',
                    available: true,
                    isAcai: false,
                    isCustomizable: true
                },
                {
                    id: 1,
                    name: '🍧 Copo de Açaí Supremo 500ml Turbinado',
                    tag: '🍧 AÇAÍ & SORVETES',
                    description: 'Açaí artesanal super cremoso montado em camadas com Leite Ninho, Nutella pura, Morangos frescos fatiados, Banana e Granola crocante + adicionais à sua escolha.',
                    price: 22.90,
                    image: 'acai_copo.svg',
                    available: true,
                    isAcai: true,
                    isCustomizable: true
                },
                {
                    id: 301,
                    name: '🍱 Marmita Executiva Bife Acebolado Premium',
                    tag: '🍱 MARMITARIA',
                    description: 'Bife bovino macio grelhado na chapa com cebolas douradas, arroz branco soltinho, feijão carioca fresquinho, farofa crocante e salada da horta.',
                    price: 24.90,
                    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&fit=crop',
                    available: true,
                    isAcai: false,
                    isCustomizable: false
                },
                {
                    id: 401,
                    name: '🍰 Bolo de Pote Ninho com Nutella & Morango',
                    tag: '🍰 CONFEITARIA',
                    description: 'Pão de ló leve e molhadinho intercalado com camadas generosas de brigadeiro de Leite Ninho, Nutella pura e pedaços de morangos frescos.',
                    price: 14.50,
                    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&fit=crop',
                    available: true,
                    isAcai: false,
                    isCustomizable: false
                },
                {
                    id: 104,
                    name: '🥤 Coca-Cola Original Lata 350ml Geladíssima',
                    tag: '🥤 BEBIDAS',
                    description: 'Lata 350ml trincando de gelada com limão e gelo sob consulta.',
                    price: 6.50,
                    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&fit=crop',
                    available: true,
                    isAcai: false,
                    isCustomizable: false
                }
            ],
            schedule: defaultSettings.schedule,
            deliveryNeighborhoods: [
                { id: 'b1', name: 'Centro / Região Central', fee: 3.00, time: '20 - 35 min', zone: 'Zona 1' },
                { id: 'b2', name: 'Jardins / Bairro Nobre', fee: 5.00, time: '25 - 40 min', zone: 'Zona 2' },
                { id: 'b3', name: 'Vila Nova / Zona Sul', fee: 7.00, time: '30 - 45 min', zone: 'Zona 3' },
                { id: 'b4', name: 'Planalto / Zona Norte', fee: 9.00, time: '35 - 50 min', zone: 'Zona 4' }
            ]
        };

        const DEFAULT_INITIAL_COMPANIES = [
            defaultDemoCompany,
            {
                id: "company-burger-don",
                slug: "hamburgueria",
                aliases: ["burger", "burguer", "don-burger", "donburger", "hamburguer", "smash"],
                isDemo: false,
                name: "Don Burger Delivery",
                email: "contato@donburger.com",
                subtitle: "Hambúrgueres artesanais na brasa, smash burgers e batata frita sequinha!",
                whatsappNumber: "5521999999999",
                instagram: "@donburger.delivery",
                cnpj: "12.345.678/0001-90",
                address: "Rua dos Burgers, 120 - Centro",
                logoUrl: "",
                adminPassword: "admin",
                deliveryFee: 6.00,
                deliveryTime: "30 - 45 min",
                presetType: "burguer",
                themeColors: {
                    name: "🔥 Hamburgueria Fire Red",
                    primary: "#DC2626",
                    primaryDark: "#991B1B",
                    secondary: "#EA580C",
                    bgAccent: "#FFF7ED"
                },
                coupons: [
                    { code: "BURGER10", discount: 10, type: "percent", minOrder: 35, active: true }
                ],
                deliveryNeighborhoods: [
                    { id: "b1", name: "Centro", fee: 4.00, time: "20 - 35 min", zone: "Zona 1" },
                    { id: "b2", name: "Bairros Próximos", fee: 6.00, time: "30 - 45 min", zone: "Zona 2" }
                ],
                products: [
                    {
                        id: 101,
                        name: "Combo X-Burguer Artesanal Duplo",
                        tag: "🔥 O MAIS PEDIDO!",
                        description: "Hambúrguer duplo 160g de blend artesanal, cheddar cremoso, bacon crocante + Batata Frita + Refrigerante",
                        price: 32.90,
                        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&fit=crop",
                        available: true,
                        isCustomizable: true
                    },
                    {
                        id: 102,
                        name: "Smash Burguer Bacon Especial",
                        tag: "⚡ NOVIDADE",
                        description: "Duas carnes smash 80g, queijo cheddar fatiado, bacon crocante e maionese artesanal defumada",
                        price: 24.90,
                        image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&fit=crop",
                        available: true,
                        isCustomizable: true
                    },
                    {
                        id: 103,
                        name: "Porção de Batata Frita Crocante (300g)",
                        tag: "🍟 ACOMPANHAMENTO",
                        description: "Batata frita bem crocante servida com molho de queijo cheddar e bacon em cubinhos",
                        price: 16.00,
                        image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&fit=crop",
                        available: true,
                        isCustomizable: false
                    },
                    {
                        id: 104,
                        name: "Refrigerante Lata 350ml",
                        tag: "🥤 BEBIDA",
                        description: "Coca-Cola, Guaraná Antarctica ou Sprite geladinhos",
                        price: 6.00,
                        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&fit=crop",
                        available: true,
                        isCustomizable: false
                    }
                ]
            },
            {
                id: "company-pizza-don",
                slug: "pizzaria",
                aliases: ["pizza", "don-pizza", "donpizza", "pizzas"],
                isDemo: false,
                name: "Don Pizza Express",
                email: "contato@donpizza.com",
                subtitle: "Pizzas artesanais de fermentação natural, forno a lenha e bordas recheadas!",
                whatsappNumber: "5521999999999",
                instagram: "@donpizza.express",
                cnpj: "23.456.789/0001-01",
                address: "Av. das Pizzas, 400 - Forno Nobre",
                logoUrl: "",
                adminPassword: "admin",
                deliveryFee: 7.00,
                deliveryTime: "35 - 50 min",
                presetType: "pizzaria",
                themeColors: {
                    name: "🟢 Pizzaria Basil Emerald",
                    primary: "#059669",
                    primaryDark: "#064E3B",
                    secondary: "#10B981",
                    bgAccent: "#ECFDF5"
                },
                coupons: [
                    { code: "PIZZA10", discount: 10, type: "percent", minOrder: 50, active: true }
                ],
                deliveryNeighborhoods: [
                    { id: "b1", name: "Região Central", fee: 5.00, time: "30 - 45 min", zone: "Zona 1" },
                    { id: "b2", name: "Bairros Adjacentes", fee: 7.00, time: "40 - 55 min", zone: "Zona 2" }
                ],
                products: [
                    {
                        id: 201,
                        name: "Pizza Grande Calabresa Especial",
                        tag: "🔥 CAMPEÃO DE VENDAS",
                        description: "Massa artesanal, molho de tomate fresco, muita calabresa fatiada, cebola roxa e azeitonas pretas",
                        price: 45.00,
                        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&fit=crop",
                        available: true,
                        isCustomizable: true
                    },
                    {
                        id: 202,
                        name: "Pizza Quatro Queijos Cremosa",
                        tag: "🧀 SUPREMA",
                        description: "Mussarela, catupiry original, provolone e gorgonzola com orégano fresco",
                        price: 48.00,
                        image: "https://images.unsplash.com/photo-1573821663912-569905455b1c?w=500&fit=crop",
                        available: true,
                        isCustomizable: true
                    },
                    {
                        id: 203,
                        name: "Pizza Brotinho Doce de Leite com Morango",
                        tag: "🍓 SOBREMESA",
                        description: "Massa fininha recheada com doce de leite cremoso e fatias de morango",
                        price: 28.00,
                        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&fit=crop",
                        available: true,
                        isCustomizable: false
                    },
                    {
                        id: 204,
                        name: "Guaraná Antarctica 2 Litros",
                        tag: "🥤 BEBIDA",
                        description: "Refrigerante Guaraná 2L trincando de gelado",
                        price: 12.00,
                        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&fit=crop",
                        available: true,
                        isCustomizable: false
                    }
                ]
            },
            {
                id: "company-marmita-don",
                slug: "marmitas-fitnes",
                aliases: ["marmitaria", "marmitas", "marmitas-fitness", "marmita", "fit", "fitness", "saudavel"],
                isDemo: false,
                name: "Don Marmitas Fit & Saudáveis",
                email: "contato@donmarmitas.com",
                subtitle: "Marmitas caseiras balanceadas, frescas e saborosas todos os dias!",
                whatsappNumber: "5521999999999",
                instagram: "@donmarmitas.fit",
                cnpj: "34.567.890/0001-12",
                address: "Rua da Saúde, 330 - Bairro Verde",
                logoUrl: "",
                adminPassword: "admin",
                deliveryFee: 5.00,
                deliveryTime: "25 - 40 min",
                presetType: "marmitaria",
                themeColors: {
                    name: "🍱 Marmitaria Caseira & Sabor",
                    primary: "#D97706",
                    primaryDark: "#92400E",
                    secondary: "#F59E0B",
                    bgAccent: "#FFFBEB"
                },
                coupons: [
                    { code: "FIT10", discount: 10, type: "percent", minOrder: 40, active: true }
                ],
                deliveryNeighborhoods: [
                    { id: "b1", name: "Centro e Arredores", fee: 4.00, time: "25 - 40 min", zone: "Zona 1" }
                ],
                products: [
                    {
                        id: 301,
                        name: "Marmita Executiva Bife Acebolado",
                        tag: "⭐ TRADICIONAL",
                        description: "Bife acebolado macio, arroz branco soltinho, feijão caseiro, farofa crocante e salada de alface",
                        price: 22.00,
                        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&fit=crop",
                        available: true,
                        isCustomizable: false
                    },
                    {
                        id: 302,
                        name: "Marmita Fit Frango com Batata Doce",
                        tag: "💪 FIT & LEVE",
                        description: "Filé de frango grelhado em cubos, batata doce assada no alecrim e mix de legumes no vapor",
                        price: 24.00,
                        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&fit=crop",
                        available: true,
                        isCustomizable: false
                    },
                    {
                        id: 303,
                        name: "Marmita Feijoada Completa",
                        tag: "🔥 SEXTA & SÁBADO",
                        description: "Feijoada saborosa com carne seca, costelinha e calabresa + couve refogada, farofa e laranjinha",
                        price: 26.00,
                        image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&fit=crop",
                        available: true,
                        isCustomizable: false
                    },
                    {
                        id: 304,
                        name: "Suco Natural de Laranja 500ml",
                        tag: "🍊 100% NATURAL",
                        description: "Suco 100% natural feito na hora sem adição de conservantes ou açúcar",
                        price: 8.00,
                        image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&fit=crop",
                        available: true,
                        isCustomizable: false
                    }
                ]
            },
            {
                id: "company-sorvete-don",
                slug: "sorveteria",
                aliases: ["sorvete", "gelato", "gelateria", "don-gelato", "paletas"],
                isDemo: false,
                name: "Don Gelato Artesanal",
                email: "contato@dongelato.com",
                subtitle: "Gelatos italianos puros, taças gourmet e sorvetes refrescantes!",
                whatsappNumber: "5521999999999",
                instagram: "@dongelato.artesanal",
                cnpj: "45.678.901/0001-23",
                address: "Praça do Sol, 88 - Vila Doce",
                logoUrl: "",
                adminPassword: "admin",
                deliveryFee: 5.00,
                deliveryTime: "20 - 35 min",
                presetType: "sorveteria",
                themeColors: {
                    name: "🔵 Sorveteria Azure Sky",
                    primary: "#0284C7",
                    primaryDark: "#0369A1",
                    secondary: "#38BDF8",
                    bgAccent: "#F0F9FF"
                },
                coupons: [
                    { code: "GELATO10", discount: 10, type: "percent", minOrder: 30, active: true }
                ],
                deliveryNeighborhoods: [
                    { id: "b1", name: "Bairros da Cidade", fee: 5.00, time: "20 - 35 min", zone: "Zona 1" }
                ],
                products: [
                    {
                        id: 501,
                        name: "Taça Sundae de Morango e Chantilly",
                        tag: "🍨 ESPECIAL",
                        description: "Sorvete cremoso com bastante calda de morango, chantilly e castanhas",
                        price: 18.90,
                        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&fit=crop",
                        available: true,
                        isCustomizable: true
                    },
                    {
                        id: 502,
                        name: "Copão de Sorvete Artesanal 2 Bolas",
                        tag: "🍦 REFRESCANTE",
                        description: "Escolha 2 sabores cremosos com direito a 2 coberturas à sua escolha",
                        price: 14.00,
                        image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&fit=crop",
                        available: true,
                        isCustomizable: true
                    },
                    {
                        id: 503,
                        name: "Pote de Sorvete 1 Litro (Sabores Variados)",
                        tag: "📦 FAMÍLIA",
                        description: "Pote de 1L com sorvete ultra cremoso para saborear em casa",
                        price: 28.00,
                        image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&fit=crop",
                        available: true,
                        isCustomizable: false
                    }
                ]
            },
            {
                id: "company-doces-don",
                slug: "confeitaria",
                aliases: ["doceria", "doces", "bolos", "don-doces", "confeitaria-sweet"],
                isDemo: false,
                name: "Don Sweet Doceria & Bolos",
                email: "contato@dondoces.com",
                subtitle: "Bolos artesanais, tortas holandesas e doces finos para alegrar o seu dia!",
                whatsappNumber: "5521999999999",
                instagram: "@dondoces.bolos",
                cnpj: "56.789.012/0001-34",
                address: "Alameda dos Doces, 55 - Centro Gourmet",
                logoUrl: "",
                adminPassword: "admin",
                deliveryFee: 6.00,
                deliveryTime: "30 - 45 min",
                presetType: "confeitaria",
                themeColors: {
                    name: "🌸 Confeitaria Sweet Berry",
                    primary: "#DB2777",
                    primaryDark: "#9D174D",
                    secondary: "#F472B6",
                    bgAccent: "#FDF2F8"
                },
                coupons: [
                    { code: "DOCE10", discount: 10, type: "percent", minOrder: 30, active: true }
                ],
                deliveryNeighborhoods: [
                    { id: "b1", name: "Todos os Bairros", fee: 6.00, time: "30 - 45 min", zone: "Zona 1" }
                ],
                products: [
                    {
                        id: 401,
                        name: "Torta Holandesa de Chocolate (Fatia)",
                        tag: "🍰 SUPREMO",
                        description: "Deliciosa fatia de torta holandesa com creme suave de baunilha e cobertura de ganache meio amargo",
                        price: 14.90,
                        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&fit=crop",
                        available: true,
                        isCustomizable: false
                    },
                    {
                        id: 402,
                        name: "Bolo de Pote Ninho com Nutella",
                        tag: "🍫 DELÍCIA",
                        description: "Massa fofinha de pão de ló intercalada com creme ninho e recheio de Nutella pura",
                        price: 12.00,
                        image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&fit=crop",
                        available: true,
                        isCustomizable: false
                    },
                    {
                        id: 403,
                        name: "Caixa de Brigadeiros Gourmet (6 un)",
                        tag: "🍬 DOCE FINO",
                        description: "Brigadeiros belga artesanais enrolados com confeitos crocantes",
                        price: 18.00,
                        image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&fit=crop",
                        available: true,
                        isCustomizable: false
                    }
                ]
            }
        ];

        function loadData() {
            // 1. Carregar Coleção de Empresas
            const savedCompanies = localStorage.getItem('companies');
            if (savedCompanies) {
                try {
                    companies = JSON.parse(savedCompanies);
                } catch(e) { companies = []; }
            }

            // Limpar empresas legadas se existirem
            if (Array.isArray(companies)) {
                companies = companies.filter(c => c && c.id !== 'company-fb-default' && c.slug !== 'acai-fb');
            }

            // Se nenhuma empresa cadastrada ou empresas incompletas, mesclar com as empresas padrão
            if (!companies || companies.length === 0) {
                companies = JSON.parse(JSON.stringify(DEFAULT_INITIAL_COMPANIES));
                localStorage.setItem('companies', JSON.stringify(companies));
            } else {
                // Garantir que todas as empresas modelo (DEFAULT_INITIAL_COMPANIES) existam na coleção
                const compMap = new Map();
                DEFAULT_INITIAL_COMPANIES.forEach(dc => {
                    compMap.set(dc.id, JSON.parse(JSON.stringify(dc)));
                });
                // Sobrescrever com personalizações salvas
                companies.forEach(c => {
                    if (c && c.id) {
                        const base = compMap.get(c.id) || {};
                        compMap.set(c.id, {
                            ...base,
                            ...c,
                            isDemo: c.id === 'company-demo-don',
                            slug: c.slug ? sanitizeSlug(c.slug) : (base.slug || generateSlug(c.name || c.id))
                        });
                    }
                });
                companies = Array.from(compMap.values());
                localStorage.setItem('companies', JSON.stringify(companies));
            }

            // 2. Determinar Empresa Ativa a partir da URL (Roteamento Dinâmico por Link Oficial: ?empresa=slug, /slug, #slug)
            const requestedParam = extractRequestedCompanyIdentifier();
            let targetCompany = null;

            if (requestedParam) {
                targetCompany = findCompanyInList(companies, requestedParam);
            }

            if (targetCompany) {
                // Link direto de uma empresa específica (ex: www.donfood.site/?empresa=marmitas-fitnes)
                activeCompanyId = targetCompany.id;
                localStorage.setItem('activeCompanyId', activeCompanyId);
            } else if (requestedParam && requestedParam.toLowerCase() !== 'demo') {
                // Se o link especificou uma empresa que ainda não foi encontrada, tenta buscar na lista
                const foundAgain = findCompanyInList(companies, requestedParam);
                if (foundAgain) {
                    activeCompanyId = foundAgain.id;
                    localStorage.setItem('activeCompanyId', activeCompanyId);
                }
            } else {
                // Acesso sem parâmetro na URL: verificar se há empresa ativa salva anteriormente
                const savedActiveId = localStorage.getItem('activeCompanyId');
                const existingComp = savedActiveId ? companies.find(c => c && c.id === savedActiveId) : null;
                if (existingComp) {
                    activeCompanyId = existingComp.id;
                } else {
                    const demoComp = companies.find(c => c.id === 'company-demo-don' || isCompanyDemo(c)) || defaultDemoCompany;
                    activeCompanyId = demoComp.id;
                    localStorage.setItem('activeCompanyId', activeCompanyId);
                }
            }

            let activeComp = companies.find(c => c.id === activeCompanyId);
            if (!activeComp) {
                activeComp = companies.find(c => c.id === 'company-demo-don') || defaultDemoCompany;
                activeCompanyId = activeComp.id;
            }

            // 3. Atualizar Visibilidade do Banner de Demonstração e Landing Page Showcase
            const isCurrentDemo = isCompanyDemo(activeComp);
            
            // Determinar visualização inicial (Landing Showcase vs Loja vs Tela de Login Dedicada)
            const urlParams = new URLSearchParams(window.location.search);
            const pathLower = (window.location.pathname || '').toLowerCase();
            const viewParam = (urlParams.get('view') || urlParams.get('pagina') || '').toLowerCase();
            const hashLower = (window.location.hash || '').toLowerCase();
            const isLoginRoute = pathLower === '/login' || pathLower.endsWith('/login') || viewParam === 'login' || hashLower === '#login';

            if (isLoginRoute) {
                currentAppView = 'login';
            } else if (requestedParam && requestedParam.toLowerCase() !== 'demo') {
                // Ao acessar link direto de uma empresa personalizada (?empresa=...), ABRIR SEMPRE O CARDÁPIO DA EMPRESA!
                currentAppView = 'store';
            } else if (!isCurrentDemo) {
                currentAppView = 'store';
            } else {
                if (hashLower === '#loja-demo' || hashLower === '#cardapio' || hashLower === '#inicio' || viewParam === 'store') {
                    currentAppView = 'store';
                } else {
                    currentAppView = 'landing';
                }
            }

            updateAppViewDisplay();

            // 3. Carregar Configurações, Produtos e Pedidos ISOLADOS por Empresa (Database Isolation)
            settings = {
                restaurantName: activeComp.name,
                email: activeComp.email || 'demo@donfood.com',
                subtitle: activeComp.subtitle,
                whatsappNumber: activeComp.whatsappNumber,
                instagram: activeComp.instagram || '',
                cnpj: activeComp.cnpj || '',
                address: activeComp.address || '',
                logoUrl: activeComp.logoUrl,
                adminPassword: activeComp.adminPassword,
                deliveryFee: activeComp.deliveryFee || 5.00,
                deliveryTime: activeComp.deliveryTime || '25 - 40 min',
                presetType: activeComp.presetType || 'burguer',
                schedule: activeComp.schedule || defaultSettings.schedule,
                themeColors: (activeComp.themeColors && activeComp.themeColors.primary) ? activeComp.themeColors : (THEME_PRESETS[activeComp.presetType] || THEME_PRESETS.burguer || defaultDemoCompany.themeColors),
                customBanner: activeComp.customBanner || null,
                customExtras: activeComp.customExtras || null,
                coupons: activeComp.coupons || (defaultSettings.coupons ? JSON.parse(JSON.stringify(defaultSettings.coupons)) : defaultCoupons),
                deliveryNeighborhoods: activeComp.deliveryNeighborhoods || (defaultSettings.deliveryNeighborhoods ? JSON.parse(JSON.stringify(defaultSettings.deliveryNeighborhoods)) : DEFAULT_DELIVERY_NEIGHBORHOODS)
            };

            products = activeComp.products || defaultProducts;

            // Carregar cupom aplicado anteriormente se salvo
            const savedAppliedCoupon = localStorage.getItem(`appliedCoupon_${activeCompanyId}`);
            if (savedAppliedCoupon) {
                try {
                    appliedCoupon = JSON.parse(savedAppliedCoupon);
                } catch(e) {
                    appliedCoupon = null;
                }
            } else {
                appliedCoupon = null;
            }

            // Aplicar Cores da empresa ativa
            applyThemeColors(settings.themeColors);

            // ISOLAMENTO DE DADOS: Carrinho e Pedidos por Empresa
            const savedCart = localStorage.getItem(`cart_${activeCompanyId}`);
            cart = savedCart ? JSON.parse(savedCart) : [];

            const savedLoggedCustomer = localStorage.getItem('loggedCustomer');
            loggedCustomer = savedLoggedCustomer ? JSON.parse(savedLoggedCustomer) : null;

            const savedAccounts = localStorage.getItem('customerAccounts');
            customerAccounts = savedAccounts ? JSON.parse(savedAccounts) : [];

            const savedOrders = localStorage.getItem(`customerOrders_${activeCompanyId}`);
            customerOrders = savedOrders ? JSON.parse(savedOrders) : (activeComp.orders || []);
            knownOrderIds = new Set((customerOrders || []).map(o => o.id));

            const savedCustomer = localStorage.getItem('customerData');
            customerData = savedCustomer ? JSON.parse(savedCustomer) : null;

            if (loggedCustomer) {
                customerData = {
                    name: loggedCustomer.name,
                    neighborhoodId: loggedCustomer.neighborhoodId || '',
                    neighborhood: loggedCustomer.neighborhood || '',
                    neighborhoodZone: loggedCustomer.neighborhoodZone || '',
                    address: loggedCustomer.address,
                    reference: loggedCustomer.reference || '',
                    phone: loggedCustomer.phone
                };
            }
        }

        function saveData() {
            // Sincronizar dados da empresa ativa no vetor global e em chaves isoladas
            let activeComp = companies.find(c => c.id === activeCompanyId);
            if (activeComp) {
                activeComp.name = settings.restaurantName;
                activeComp.email = settings.email || activeComp.email || 'donfim@gmail.com';
                activeComp.slug = settings.slug || activeComp.slug || getCompanySlug(activeComp);
                if (activeComp.name !== 'Don Food' || (activeComp.slug && activeComp.slug !== 'demo') || activeComp.logoUrl) {
                    activeComp.isDemo = false;
                    activeComp.isCustomized = true;
                }
                activeComp.subtitle = settings.subtitle;
                activeComp.whatsappNumber = settings.whatsappNumber;
                activeComp.instagram = settings.instagram || '';
                activeComp.cnpj = settings.cnpj || '';
                activeComp.address = settings.address || '';
                activeComp.logoUrl = settings.logoUrl;
                activeComp.adminPassword = settings.adminPassword;
                activeComp.deliveryFee = settings.deliveryFee;
                activeComp.deliveryTime = settings.deliveryTime || '30 - 45 min';
                activeComp.presetType = settings.presetType;
                activeComp.schedule = settings.schedule;
                activeComp.themeColors = settings.themeColors;
                activeComp.customBanner = settings.customBanner;
                activeComp.customExtras = settings.customExtras;
                activeComp.coupons = settings.coupons;
                activeComp.deliveryNeighborhoods = settings.deliveryNeighborhoods;
                activeComp.products = products;
                activeComp.orders = customerOrders;
            }

            localStorage.setItem('companies', JSON.stringify(companies));
            localStorage.setItem('activeCompanyId', activeCompanyId);
            localStorage.setItem(`products_${activeCompanyId}`, JSON.stringify(products));
            localStorage.setItem(`settings_${activeCompanyId}`, JSON.stringify(settings));
            localStorage.setItem(`customerOrders_${activeCompanyId}`, JSON.stringify(customerOrders));
            localStorage.setItem(`cart_${activeCompanyId}`, JSON.stringify(cart));
            localStorage.setItem('customerAccounts', JSON.stringify(customerAccounts));
            
            if (appliedCoupon) {
                localStorage.setItem(`appliedCoupon_${activeCompanyId}`, JSON.stringify(appliedCoupon));
            } else {
                localStorage.removeItem(`appliedCoupon_${activeCompanyId}`);
            }
            
            if (loggedCustomer) {
                localStorage.setItem('loggedCustomer', JSON.stringify(loggedCustomer));
            }
            if (customerData) {
                localStorage.setItem('customerData', JSON.stringify(customerData));
            }

            debouncedSyncCompaniesToServer();
        }

        function switchActiveCompany(identifier) {
            if (!identifier) return;
            let target = (companies || []).find(c => c && (c.id === identifier || c.slug === identifier));
            if (!target) {
                target = findCompanyInList(companies, identifier);
            }
            if (!target) {
                target = companies.find(c => c.id === 'company-demo-don') || defaultDemoCompany;
            }

            activeCompanyId = target.id;
            localStorage.setItem('activeCompanyId', activeCompanyId);
            currentAppView = 'store';
            
            // Atualizar a URL no navegador para refletir a empresa ativa
            try {
                if (target && !isCompanyDemo(target) && target.slug) {
                    window.history.pushState({ view: 'store', company: target.slug }, '', `/?empresa=${encodeURIComponent(target.slug)}`);
                } else {
                    window.history.pushState({ view: 'store', company: 'demo' }, '', '/?empresa=demo');
                }
            } catch (e) {}

            loadData();
            renderAll();
            fetchOrdersFromServer(true);
            connectOrdersRealtimeStream();
            showNotification(`Loja aberta: ${settings.restaurantName} 🏪`, 'success');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function openStoreBySlug(slug) {
            switchActiveCompany(slug);
        }
        window.openStoreBySlug = openStoreBySlug;

        function switchActiveCompanyFromSelect(companyId) {
            switchActiveCompany(companyId);
        }

        function renderActiveCompanySelectUI() {
            const select = document.getElementById('activeCompanySelect');
            if (!select) return;
            select.innerHTML = companies.map(c => `
                <option value="${c.id}" ${c.id === activeCompanyId ? 'selected' : ''}>
                    ${c.name} (${c.whatsappNumber || 'Sem Whats'}) ${c.isDemo ? '★ Demo' : ''}
                </option>
            `).join('');
        }

        // ========== MÁSCARA TELEFÔNICA (DDD + NÚMERO) ==========
        function maskPhoneInput(input) {
            if (!input) return;
            let v = input.value.replace(/\D/g, '');
            if (v.length > 11) v = v.substring(0, 11);
            if (v.length > 10) {
                input.value = `(${v.substring(0,2)}) ${v.substring(2,7)}-${v.substring(7)}`;
            } else if (v.length > 6) {
                input.value = `(${v.substring(0,2)}) ${v.substring(2,6)}-${v.substring(6)}`;
            } else if (v.length > 2) {
                input.value = `(${v.substring(0,2)}) ${v.substring(2)}`;
            } else if (v.length > 0) {
                input.value = `(${v}`;
            } else {
                input.value = '';
            }
        }

        // ========== GERENCIADOR DE TESTE GRÁTIS 24H NA LOJA DEMO (CAPTURA DE LEADS) ==========
        const DemoTrialManager = {
            STORAGE_KEY: 'donfood_demo_trial',
            LEADS_KEY: 'donfood_demo_leads',

            isTrialActive() {
                try {
                    const raw = localStorage.getItem(this.STORAGE_KEY);
                    if (!raw) return false;
                    const data = JSON.parse(raw);
                    if (!data || !data.expiresAt) return false;
                    return Number(data.expiresAt) > Date.now();
                } catch {
                    return false;
                }
            },

            getTrialData() {
                try {
                    const raw = localStorage.getItem(this.STORAGE_KEY);
                    if (!raw) return null;
                    return JSON.parse(raw);
                } catch {
                    return null;
                }
            },

            getRemainingTimeFormatted() {
                const data = this.getTrialData();
                if (!data || !data.expiresAt) return 'Expirado';
                const diff = Number(data.expiresAt) - Date.now();
                if (diff <= 0) return 'Expirado';
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                return `${hours}h ${minutes}min`;
            },

            async unlock(phone, name) {
                const cleanPhone = (phone || '').replace(/\D/g, '');
                if (!cleanPhone || cleanPhone.length < 10) {
                    throw new Error('Número de WhatsApp inválido (mínimo 10 dígitos com DDD).');
                }

                const now = Date.now();
                const expiresAt = now + 24 * 60 * 60 * 1000;
                const leadRecord = {
                    id: 'lead_' + now + '_' + Math.random().toString(36).substring(2, 6),
                    phone: phone.trim(),
                    cleanPhone: cleanPhone,
                    name: (name || '').trim() || 'Interessado Demo',
                    unlockedAt: now,
                    expiresAt: expiresAt,
                    createdAt: new Date().toISOString(),
                    status: 'ACTIVE_TRIAL'
                };

                // Salvar localmente no navegador
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(leadRecord));

                // Salvar lista acumulada de leads no localStorage
                try {
                    const existingLeadsRaw = localStorage.getItem(this.LEADS_KEY);
                    let leadsList = existingLeadsRaw ? JSON.parse(existingLeadsRaw) : [];
                    const idx = leadsList.findIndex(l => (l.phone || '').replace(/\D/g, '') === cleanPhone);
                    if (idx >= 0) {
                        leadsList[idx] = { ...leadsList[idx], ...leadRecord, unlockCount: (leadsList[idx].unlockCount || 1) + 1 };
                    } else {
                        leadsList.unshift(leadRecord);
                    }
                    localStorage.setItem(this.LEADS_KEY, JSON.stringify(leadsList));
                } catch (e) {
                    console.error('Erro ao armazenar lead localmente:', e);
                }

                // Sincronizar com servidor Node.js backend
                try {
                    await fetch('/api/demo/unlock', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            phone: phone.trim(),
                            name: (name || '').trim(),
                            storeSlug: 'demo',
                            source: 'store-demo'
                        })
                    });
                } catch (err) {
                    console.warn('Sincronização com backend offline.');
                }

                return leadRecord;
            },

            updateDemoBannerUI() {
                const noticeBar = document.getElementById('demoNoticeBar');
                if (!noticeBar) return;

                const activeComp = (typeof companies !== 'undefined' && companies.find(c => c.id === activeCompanyId)) || settings;
                const isCurrentDemo = activeComp.isDemo || activeComp.slug === 'demo' || activeComp.id === 'company-demo-don';

                if (!isCurrentDemo || currentAppView !== 'store') {
                    noticeBar.style.display = 'none';
                    return;
                }

                noticeBar.style.display = 'block';

                const isUnlocked = this.isTrialActive();
                const trialData = this.getTrialData();

                if (isUnlocked && trialData) {
                    const remaining = this.getRemainingTimeFormatted();
                    noticeBar.innerHTML = `
                        <div class="demo-notice-glow-box" style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap; background: linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.95)); border: 1.5px solid #6EE7B7; color: white;">
                            <div style="display: flex; align-items: center; gap: 0.6rem;">
                                <span style="font-size: 1.25rem;">⏱️</span>
                                <div>
                                    <strong style="display: block; font-size: 0.92rem; color: #FFFFFF;">Área do Cliente Liberada (Teste Grátis 24h)</strong>
                                    <small style="color: #ECFDF5; font-size: 0.8rem;">Tempo restante: <strong>${remaining}</strong> • Contato: <strong>${trialData.phone}</strong></small>
                                </div>
                            </div>
                            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                                <button type="button" onclick="switchToLandingView(event)" class="btn-admin" style="font-size: 0.82rem; padding: 5px 14px; font-weight: 700; border-radius: 50px; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.4); cursor: pointer;">
                                    ← Apresentação
                                </button>
                                <button type="button" onclick="openAcquireAppModal()" class="btn-acquire-header" style="font-size: 0.82rem; padding: 5px 14px; font-weight: 700; border-radius: 50px; background: #FFFFFF; color: #047857; box-shadow: 0 2px 10px rgba(0,0,0,0.15);">
                                    💎 Quero Este Sistema
                                </button>
                            </div>
                        </div>
                    `;
                } else {
                    noticeBar.innerHTML = `
                        <div class="demo-notice-glow-box" style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap; background: linear-gradient(135deg, #9A3412, #7C2D12); border: 1.5px solid #FDBA74; color: white;">
                            <div style="display: flex; align-items: center; gap: 0.6rem;">
                                <span style="font-size: 1.25rem;">🔒</span>
                                <div>
                                    <strong style="display: block; font-size: 0.92rem; color: #FFFFFF;">Loja de Demonstração Don Food (Modo Visual)</strong>
                                    <small style="color: #FED7AA; font-size: 0.8rem;">Libere o cardápio interativo e teste grátis por 24 horas.</small>
                                </div>
                            </div>
                            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                                <button type="button" onclick="openDemoLeadModal()" class="btn-admin" style="font-size: 0.85rem; padding: 6px 16px; font-weight: 800; border-radius: 50px; background: linear-gradient(135deg, #F59E0B, #D97706); color: white; border: none; cursor: pointer; box-shadow: 0 3px 12px rgba(245, 158, 11, 0.4);">
                                    🔓 Desbloquear Teste 24h
                                </button>
                                <button type="button" onclick="switchToLandingView(event)" class="btn-admin" style="font-size: 0.82rem; padding: 5px 14px; font-weight: 700; border-radius: 50px; background: rgba(255,255,255,0.15); color: white; border: 1px solid rgba(255,255,255,0.3); cursor: pointer;">
                                    ← Apresentação
                                </button>
                            </div>
                        </div>
                    `;
                }
            }
        };

        function openDemoLeadModal() {
            const modal = document.getElementById('demoLeadCaptureModal');
            if (modal) {
                modal.classList.add('active');
                const phoneInput = document.getElementById('demoLeadPhoneInput');
                if (phoneInput) {
                    setTimeout(() => phoneInput.focus(), 100);
                }
            }
        }

        function closeDemoLeadModal() {
            const modal = document.getElementById('demoLeadCaptureModal');
            if (modal) modal.classList.remove('active');
        }

        async function handleDemoLeadUnlockSubmit(e) {
            if (e) e.preventDefault();
            const phoneInput = document.getElementById('demoLeadPhoneInput');
            const nameInput = document.getElementById('demoLeadNameInput');
            const errorEl = document.getElementById('demoLeadError');
            const btnSubmit = document.getElementById('btnDemoUnlockSubmit');

            const phone = phoneInput ? phoneInput.value.trim() : '';
            const name = nameInput ? nameInput.value.trim() : '';
            const cleanPhone = phone.replace(/\D/g, '');

            if (!cleanPhone || cleanPhone.length < 10) {
                if (errorEl) {
                    errorEl.style.display = 'block';
                    errorEl.textContent = '❌ Por favor, digite um número de WhatsApp válido com DDD (mínimo 10 dígitos).';
                }
                if (phoneInput) phoneInput.focus();
                return;
            }

            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.innerHTML = '⏳ Liberando Acesso...';
            }

            try {
                await DemoTrialManager.unlock(phone, name);
                if (errorEl) errorEl.style.display = 'none';
                closeDemoLeadModal();
                DemoTrialManager.updateDemoBannerUI();
                showNotification(`🎉 Teste liberado com sucesso por 24 horas! Aproveite para montar pedidos e testar o cardápio.`, 'success');
            } catch (err) {
                if (errorEl) {
                    errorEl.style.display = 'block';
                    errorEl.textContent = `❌ ${err.message || 'Erro ao liberar teste.'}`;
                }
            } finally {
                if (btnSubmit) {
                    btnSubmit.disabled = false;
                    btnSubmit.innerHTML = '🔓 Desbloquear Acesso por 24 Horas';
                }
            }
        }

        function openDemoAdminBlockedModal() {
            const modal = document.getElementById('demoAdminBlockedModal');
            if (modal) modal.classList.add('active');
        }

        function closeDemoAdminBlockedModal() {
            const modal = document.getElementById('demoAdminBlockedModal');
            if (modal) modal.classList.remove('active');
        }

        // ========== GESTÃO DE LEADS CAPTURADOS NO PAINEL DEV ==========
        let devLeadsData = [];

        async function fetchDevLeads() {
            try {
                const authHeader = (typeof AuthManager !== 'undefined' && AuthManager.getAuthHeader) ? AuthManager.getAuthHeader() : null;
                const headers = authHeader ? { 'Authorization': authHeader } : {};
                const response = await fetch('/api/dev/leads', { headers });
                const res = await response.json();
                if (res && res.success && Array.isArray(res.data)) {
                    devLeadsData = res.data;
                } else {
                    const local = localStorage.getItem(DemoTrialManager.LEADS_KEY);
                    devLeadsData = local ? JSON.parse(local) : [];
                }
            } catch {
                const local = localStorage.getItem(DemoTrialManager.LEADS_KEY);
                devLeadsData = local ? JSON.parse(local) : [];
            }

            renderDevLeadsList();
        }

        function renderDevLeadsList() {
            const listEl = document.getElementById('devLeadsList');
            const totalEl = document.getElementById('devMetricTotalLeads');
            const activeEl = document.getElementById('devMetricActiveLeads');
            const expiredEl = document.getElementById('devMetricExpiredLeads');
            const countBadge = document.getElementById('devLeadsCount');
            const searchInput = document.getElementById('devLeadsSearchInput');
            const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

            const now = Date.now();
            let total = devLeadsData.length;
            let active = 0;
            let expired = 0;

            devLeadsData.forEach(lead => {
                const exp = lead.trialExpiresAt || lead.expiresAt;
                if (exp && Number(exp) > now) {
                    active++;
                } else {
                    expired++;
                }
            });

            if (totalEl) totalEl.textContent = total;
            if (activeEl) activeEl.textContent = active;
            if (expiredEl) expiredEl.textContent = expired;
            if (countBadge) countBadge.textContent = total;

            if (!listEl) return;

            let filtered = devLeadsData.filter(lead => {
                if (!searchTerm) return true;
                const nameMatch = (lead.name || '').toLowerCase().includes(searchTerm);
                const phoneMatch = (lead.phone || '').includes(searchTerm) || (lead.cleanPhone || '').includes(searchTerm);
                return nameMatch || phoneMatch;
            });

            if (filtered.length === 0) {
                listEl.innerHTML = `
                    <div style="background: white; border: 1px dashed var(--gray-300); border-radius: 10px; padding: 2rem; text-align: center; color: var(--gray-500);">
                        <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">🎯</span>
                        <strong style="color: var(--gray-700);">Nenhum contato encontrado</strong>
                        <p style="font-size: 0.85rem; margin: 0.25rem 0 0 0;">Quando visitantes inserirem o telefone na Loja Demo, eles aparecerão aqui automaticamente.</p>
                    </div>
                `;
                return;
            }

            listEl.innerHTML = filtered.map(lead => {
                const exp = lead.trialExpiresAt || lead.expiresAt;
                const isLeadActive = exp ? (Number(exp) > now) : false;
                const remainingHours = exp ? Math.max(0, Math.round((Number(exp) - now) / 3600000)) : 0;
                const cleanPhone = (lead.phone || '').replace(/\D/g, '');
                const formattedDate = lead.createdAt ? new Date(lead.createdAt).toLocaleString('pt-BR') : 'Data não informada';
                const leadName = lead.name || 'Interessado Demo';
                const whatsappMsg = encodeURIComponent(`Olá, ${leadName}! Vi que você testou o cardápio digital do Don Food. O que achou da experiência? Posso tirar alguma dúvida ou apresentar as condições para o seu estabelecimento?`);

                return `
                    <div style="background: white; border: 1px solid var(--gray-200); border-radius: 10px; padding: 0.85rem; display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div style="width: 42px; height: 42px; background: ${isLeadActive ? '#ECFDF5' : '#F1F5F9'}; color: ${isLeadActive ? '#059669' : '#64748B'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                                📱
                            </div>
                            <div>
                                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                                    <strong style="color: #1E1B4B; font-size: 0.95rem;">${lead.phone}</strong>
                                    <span style="font-size: 0.75rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 20px; background: ${isLeadActive ? '#DCFCE7' : '#F1F5F9'}; color: ${isLeadActive ? '#15803D' : '#64748B'};">
                                        ${isLeadActive ? `🟢 Ativo (${remainingHours}h restantes)` : '⏳ Expirado'}
                                    </span>
                                </div>
                                <div style="font-size: 0.82rem; color: #4B5563; margin-top: 0.15rem;">
                                    <span>👤 <strong>${leadName}</strong></span> • <small style="color: #64748B;">Cadastrado em: ${formattedDate}</small>
                                </div>
                            </div>
                        </div>

                        <div style="display: flex; gap: 0.4rem; align-items: center;">
                            <a href="https://wa.me/55${cleanPhone}?text=${whatsappMsg}" target="_blank" class="btn-admin" style="background: #25D366; color: white; font-weight: 700; font-size: 0.8rem; padding: 0.4rem 0.8rem; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 0.3rem;" title="Iniciar conversa comercial no WhatsApp">
                                💬 WhatsApp
                            </a>
                            <button type="button" class="btn-admin" onclick="copyLeadPhone('${lead.phone}')" style="background: var(--gray-100); color: var(--gray-700); font-size: 0.8rem; padding: 0.4rem 0.6rem; border-radius: 8px;" title="Copiar Telefone">
                                📋
                            </button>
                            <button type="button" class="btn-admin" onclick="deleteDevLead('${lead.id || cleanPhone}')" style="background: #FEE2E2; color: #DC2626; font-size: 0.8rem; padding: 0.4rem 0.6rem; border-radius: 8px;" title="Excluir Lead">
                                🗑️
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function filterDevLeadsList() {
            renderDevLeadsList();
        }

        function copyLeadPhone(phone) {
            if (!phone) return;
            navigator.clipboard.writeText(phone);
            showNotification(`Telefone ${phone} copiado! 📋`, 'success');
        }

        function copyAllLeadPhones() {
            if (!devLeadsData || devLeadsData.length === 0) {
                showNotification('Nenhum telefone para copiar.', 'warning');
                return;
            }
            const phones = devLeadsData.map(l => l.phone).filter(Boolean).join('\n');
            navigator.clipboard.writeText(phones);
            showNotification(`📋 ${devLeadsData.length} telefones copiados para a área de transferência!`, 'success');
        }

        function exportLeadsCSV() {
            if (!devLeadsData || devLeadsData.length === 0) {
                showNotification('Nenhum contato para exportar.', 'warning');
                return;
            }

            let csv = "Telefone;Nome;Data_Criacao;Status;Horas_Restantes\n";
            const now = Date.now();
            devLeadsData.forEach(l => {
                const exp = l.trialExpiresAt || l.expiresAt;
                const isActive = exp ? (Number(exp) > now) : false;
                const hours = exp ? Math.max(0, Math.round((Number(exp) - now) / 3600000)) : 0;
                csv += `"${l.phone || ''}";"${l.name || ''}";"${l.createdAt || ''}";"${isActive ? 'ATIVO' : 'EXPIRADO'}";"${hours}"\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `leads_donfood_demo_${new Date().toISOString().slice(0,10)}.csv`;
            link.click();
            URL.revokeObjectURL(url);
            showNotification('📥 Planilha de leads exportada com sucesso!', 'success');
        }

        async function deleteDevLead(id) {
            if (!confirm('Deseja realmente remover este contato da lista de leads?')) return;

            try {
                const authHeader = (typeof AuthManager !== 'undefined' && AuthManager.getAuthHeader) ? AuthManager.getAuthHeader() : null;
                const headers = authHeader ? { 'Authorization': authHeader } : {};
                await fetch(`/api/dev/leads/${id}`, { method: 'DELETE', headers });
            } catch {}

            devLeadsData = devLeadsData.filter(l => l.id !== id && l.cleanPhone !== id);
            try {
                localStorage.setItem(DemoTrialManager.LEADS_KEY, JSON.stringify(devLeadsData));
            } catch {}

            renderDevLeadsList();
            showNotification('Contato removido da lista.', 'info');
        }

        // ========== GERENCIAMENTO DE VISUALIZAÇÃO (LANDING vs LOJA DEMO vs LOGIN DEDICADO) ==========
        function updateHeaderNavForCurrentView() {
            const mainHeaderNav = document.getElementById('mainHeaderNav');
            if (!mainHeaderNav) return;

            const activeComp = (typeof companies !== 'undefined' && companies.find(c => c.id === activeCompanyId)) || settings;
            const isCurrentDemo = activeComp.isDemo || activeComp.slug === 'demo' || activeComp.id === 'company-demo-don';

            if (currentAppView === 'login') {
                mainHeaderNav.innerHTML = `
                    <a href="javascript:void(0)" onclick="switchToStoreView('header')" class="nav-link" style="color: #EA580C; font-weight: 800; display: inline-flex; align-items: center; gap: 0.35rem;">🛍️ Ir para o Cardápio</a>
                    <a href="javascript:void(0)" onclick="switchToLandingView(event)" class="nav-link" style="color: #4F46E5; font-weight: 700; display: inline-flex; align-items: center; gap: 0.3rem;">🏠 Apresentação Don Food</a>
                `;
            } else if (isCurrentDemo) {
                if (currentAppView === 'landing') {
                    mainHeaderNav.innerHTML = `
                        <a href="#demoLandingHero" onclick="switchToLandingView(event)" class="nav-link">Início</a>
                        <a href="#demoComparativo" class="nav-link">0% Comissões</a>
                        <a href="#demoDemonstracao" class="nav-link">Recursos</a>
                        <a href="#demoEconomia" class="nav-link">Economia</a>
                        <a href="#demoDepoimentos" class="nav-link">Depoimentos</a>
                        <a href="javascript:void(0)" onclick="switchToStoreView('header')" class="nav-link" id="navLinkLojaDemo" style="color: #EA580C; font-weight: 800; background: #FFF7ED; padding: 0.35rem 0.85rem; border-radius: 20px; border: 1.5px solid #FDBA74; display: inline-flex; align-items: center; gap: 0.35rem; box-shadow: 0 2px 6px rgba(234, 88, 12, 0.15);">🛍️ Demonstração</a>
                    `;
                } else {
                    mainHeaderNav.innerHTML = `
                        <a href="javascript:void(0)" onclick="switchToLandingView(event)" class="nav-link" style="color: #4F46E5; font-weight: 700; display: inline-flex; align-items: center; gap: 0.3rem;">← Apresentação Don Food</a>
                        <a href="#inicio" class="nav-link">Início</a>
                        <a href="#cardapio" class="nav-link" style="color: #EA580C; font-weight: 800;">Cardápio</a>
                    `;
                }
            } else {
                mainHeaderNav.innerHTML = `
                    <a href="#inicio" class="nav-link">Início</a>
                    <a href="#cardapio" class="nav-link">Cardápio</a>
                `;
            }
        }

        function updateAppViewDisplay() {
            const activeComp = (typeof companies !== 'undefined' && companies.find(c => c.id === activeCompanyId)) || settings;
            const isCurrentDemo = isCompanyDemo(activeComp);

            const demoHero = document.getElementById('demoLandingHero');
            const storeWrapper = document.getElementById('storeViewWrapper');
            const loginWrapper = document.getElementById('loginViewWrapper');
            const demoBar = document.getElementById('demoNoticeBar');
            const heroSection = document.getElementById('inicio');

            // Atualiza classe do body para sincronia visual com CSS
            document.body.classList.remove('view-landing', 'view-store', 'view-login');
            document.body.classList.add('view-' + currentAppView);

            if (currentAppView === 'login') {
                if (demoHero) demoHero.style.display = 'none';
                if (storeWrapper) storeWrapper.style.display = 'none';
                if (loginWrapper) loginWrapper.style.display = 'block';
                if (demoBar) demoBar.style.display = 'none';
                if (heroSection) heroSection.classList.remove('has-demo-landing');
                refreshDedicatedLoginUI();
            } else if (!isCurrentDemo) {
                currentAppView = 'store';
                document.body.classList.remove('view-landing', 'view-login');
                document.body.classList.add('view-store');
                if (demoHero) demoHero.style.display = 'none';
                if (storeWrapper) storeWrapper.style.display = 'block';
                if (loginWrapper) loginWrapper.style.display = 'none';
                if (demoBar) demoBar.style.display = 'none';
                if (heroSection) heroSection.classList.remove('has-demo-landing');
            } else {
                if (currentAppView === 'landing') {
                    if (demoHero) demoHero.style.display = 'block';
                    if (storeWrapper) storeWrapper.style.display = 'none';
                    if (loginWrapper) loginWrapper.style.display = 'none';
                    if (demoBar) demoBar.style.display = 'none';
                    if (heroSection) heroSection.classList.add('has-demo-landing');
                } else {
                    if (demoHero) demoHero.style.display = 'none';
                    if (storeWrapper) storeWrapper.style.display = 'block';
                    if (loginWrapper) loginWrapper.style.display = 'none';
                    if (demoBar) demoBar.style.display = 'block';
                    if (heroSection) heroSection.classList.remove('has-demo-landing');
                    DemoTrialManager.updateDemoBannerUI();
                }
            }

            updateHeaderNavForCurrentView();

            // Atualizar visibilidade das ações do cabeçalho (Carrinho, Quero Testar, Cliente, Empresa)
            const cartBtn = document.getElementById('cartBtn');
            const btnAcquireHeader = document.getElementById('btnAcquireHeader');
            const customerContainer = document.getElementById('customerHeaderContainer');
            const adminContainer = document.getElementById('adminHeaderContainer');
            const mobileMenu = document.getElementById('mobileHeaderMenuContainer');
            const qrFab = document.getElementById('qrFab');
            const instagramFab = document.getElementById('instagramFab');

            if (currentAppView === 'landing' || currentAppView === 'login') {
                if (cartBtn) cartBtn.style.display = 'none';
                if (btnAcquireHeader) btnAcquireHeader.style.display = 'none';
                if (customerContainer) customerContainer.style.display = 'none';
                if (adminContainer) adminContainer.style.display = 'none';
                if (mobileMenu) mobileMenu.style.display = 'none';
                if (qrFab) qrFab.style.display = 'none';
                if (instagramFab) instagramFab.style.display = 'none';
            } else {
                if (cartBtn) cartBtn.style.display = 'flex';
                if (mobileMenu) mobileMenu.style.display = '';
                if (qrFab) qrFab.style.display = 'inline-flex';
                
                // Exibir Instagram apenas se a empresa ativa tiver Instagram configurado e não for a loja demo
                const activeComp = (typeof companies !== 'undefined' && companies.find(c => c.id === activeCompanyId)) || settings;
                const isDemo = activeComp.isDemo || activeComp.slug === 'demo' || activeComp.id === 'company-demo-don';
                const igVal = (settings.instagram || '').trim();
                if (instagramFab) {
                    if (!isDemo && igVal) {
                        const cleanIg = igVal.replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '').trim();
                        if (cleanIg) {
                            instagramFab.href = `https://instagram.com/${cleanIg}`;
                            instagramFab.style.display = 'flex';
                        } else {
                            instagramFab.style.display = 'none';
                        }
                    } else {
                        instagramFab.style.display = 'none';
                    }
                }

                if (btnAcquireHeader) {
                    btnAcquireHeader.style.display = isCurrentDemo ? 'inline-flex' : 'none';
                    if (isCurrentDemo) btnAcquireHeader.textContent = 'Quero Testar';
                }
                if (customerContainer) customerContainer.style.display = 'block';
                if (adminContainer) adminContainer.style.display = 'flex';
                updateCustomerHeaderUI();
            }
        }

        let isRegisteredCompanyLoginActive = false;

        function showRegisteredCompanyLoginForm() {
            isRegisteredCompanyLoginActive = true;
            refreshDedicatedLoginUI();
            setTimeout(() => {
                const emailInput = document.getElementById('dedicatedLoginEmail');
                if (emailInput) {
                    emailInput.focus();
                }
            }, 100);
        }

        function showDemoInfoPanel() {
            isRegisteredCompanyLoginActive = false;
            refreshDedicatedLoginUI();
        }

        function refreshDedicatedLoginUI() {
            const activeComp = (typeof companies !== 'undefined' && companies.find(c => c.id === activeCompanyId)) || settings;
            const isCurrentDemo = isCompanyDemo(activeComp);
            
            // Se a empresa ativa não for Demo, forçar sempre tela de login da empresa cadastrada
            if (!isCurrentDemo) {
                isRegisteredCompanyLoginActive = true;
            }

            // 1. Atualizar Fundo de Boas-Vindas e Textos da Hero
            const storeNameEl = document.getElementById('loginViewStoreName');
            const heroBadgeText = document.getElementById('loginHeroBadgeText');
            const heroSubtitle = document.getElementById('loginHeroSubtitle');

            if (isCurrentDemo && !isRegisteredCompanyLoginActive) {
                if (storeNameEl) storeNameEl.textContent = '"Don Food (Demonstração)"';
                if (heroBadgeText) heroBadgeText.textContent = '🛍️ LOJA DE DEMONSTRAÇÃO DON FOOD';
                if (heroSubtitle) heroSubtitle.textContent = 'Explore nosso cardápio modelo e veja como a plataforma Don Food potencializa as vendas do seu estabelecimento pelo WhatsApp.';
            } else {
                const displayName = (!isCurrentDemo && activeComp.name) ? `"${activeComp.name}"` : '"Don Food - Empresas Parceiras"';
                if (storeNameEl) storeNameEl.textContent = displayName;
                if (heroBadgeText) heroBadgeText.textContent = '🔐 PAINEL EXCLUSIVO DO LOJISTA';
                if (heroSubtitle) heroSubtitle.textContent = 'Acesse o painel para gerenciar cardápio, acompanhar pedidos em tempo real, configurar taxas de entrega e personalizar a identidade visual da sua empresa.';
            }

            // 2. Avatar / Ícone da Loja
            const avatarEl = document.getElementById('loginStoreIconAvatar');
            if (avatarEl) {
                if (!isCurrentDemo && settings.logo && (settings.logo.startsWith('http') || settings.logo.startsWith('data:image'))) {
                    avatarEl.innerHTML = `<img src="${settings.logo}" alt="Logo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 18px;">`;
                } else {
                    avatarEl.textContent = '🏬';
                }
            }

            // 3. Título e Subtítulo do Card de Empresa Cadastrada
            const cardTitleEl = document.getElementById('loginCardTitle');
            const cardSubtitleEl = document.getElementById('loginCardSubtitle');
            if (cardTitleEl) {
                cardTitleEl.textContent = (!isCurrentDemo && activeComp.name) ? `Acessar Painel: ${activeComp.name}` : 'Acessar Minha Loja';
            }
            if (cardSubtitleEl) {
                cardSubtitleEl.innerHTML = 'Digite o <strong>E-mail ou Telefone</strong> e a <strong>Senha</strong> do seu estabelecimento';
            }

            // 4. Alternar Visualização entre Conectado, Loja Demo e Login de Empresas Cadastradas
            const isOwner = AuthManager.isCompanyOwner(activeCompanyId) || AuthManager.isSuperAdmin();
            const alreadyLoggedBox = document.getElementById('loginAlreadyLoggedBox');
            const demoCard = document.getElementById('loginDemoCard');
            const registeredCard = document.getElementById('loginRegisteredCard');
            const alreadyStoreName = document.getElementById('loginAlreadyStoreName');
            const btnBackToDemo = document.getElementById('btnBackToDemoFromLogin');
            const bulletBackToDemo = document.getElementById('bulletBackToDemo');

            if (isOwner) {
                if (alreadyLoggedBox) alreadyLoggedBox.style.display = 'block';
                if (demoCard) demoCard.style.display = 'none';
                if (registeredCard) registeredCard.style.display = 'none';
                if (alreadyStoreName) alreadyStoreName.textContent = activeComp.name || settings.restaurantName || 'Sua Loja';
            } else {
                if (alreadyLoggedBox) alreadyLoggedBox.style.display = 'none';

                if (isCurrentDemo && !isRegisteredCompanyLoginActive) {
                    // Janela exclusiva da Loja Demo
                    if (demoCard) demoCard.style.display = 'block';
                    if (registeredCard) registeredCard.style.display = 'none';
                } else {
                    // Janela de Login das Empresas Cadastradas
                    if (demoCard) demoCard.style.display = 'none';
                    if (registeredCard) registeredCard.style.display = 'block';

                    // Exibir botão de retorno à Demo se veio do contexto Demo
                    if (isCurrentDemo) {
                        if (btnBackToDemo) btnBackToDemo.style.display = 'inline-block';
                        if (bulletBackToDemo) bulletBackToDemo.style.display = 'inline';
                    } else {
                        if (btnBackToDemo) btnBackToDemo.style.display = 'none';
                        if (bulletBackToDemo) bulletBackToDemo.style.display = 'none';
                    }
                }
            }

            // 5. Limpar erros
            const errorEl = document.getElementById('dedicatedLoginError');
            if (errorEl) errorEl.style.display = 'none';
        }

        function handleDedicatedCompanyChange(selectEl) {
            if (!selectEl || !selectEl.value) return;
            switchActiveCompany(selectEl.value);
            refreshDedicatedLoginUI();
        }

        function switchToLoginView(e, targetCompId = null, forceRegistered = false) {
            if (e && e.preventDefault) e.preventDefault();
            if (targetCompId) {
                switchActiveCompany(targetCompId);
            }
            
            const activeComp = (typeof companies !== 'undefined' && companies.find(c => c.id === activeCompanyId)) || settings;
            const isCurrentDemo = isCompanyDemo(activeComp);

            if (!isCurrentDemo || forceRegistered) {
                isRegisteredCompanyLoginActive = true;
            } else {
                isRegisteredCompanyLoginActive = false;
            }

            currentAppView = 'login';
            updateAppViewDisplay();
            
            // Sincronizar URL para /login sem recarregar
            try {
                const urlParams = new URLSearchParams(window.location.search);
                if (activeComp && activeComp.slug && !isCurrentDemo) {
                    urlParams.set('empresa', activeComp.slug);
                }
                const newQuery = urlParams.toString() ? '?' + urlParams.toString() : '';
                window.history.pushState({ view: 'login' }, '', '/login' + newQuery);
            } catch (err) {
                // Fallback silencioso para navegadores com restrições de histórico
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Focar no campo de e-mail/telefone em branco se estiver no modo de login cadastrado
            setTimeout(() => {
                if (isRegisteredCompanyLoginActive) {
                    const emailInput = document.getElementById('dedicatedLoginEmail');
                    const passwordInput = document.getElementById('dedicatedLoginPassword');
                    if (emailInput) {
                        emailInput.value = '';
                        emailInput.focus();
                    }
                    if (passwordInput) {
                        passwordInput.value = '';
                    }
                }
            }, 150);
        }

        function switchToStoreView(source) {
            currentAppView = 'store';
            updateAppViewDisplay();

            // Atualizar URL de volta à loja/cardápio
            try {
                const activeComp = (typeof companies !== 'undefined' && companies.find(c => c.id === activeCompanyId)) || settings;
                const isCurrentDemo = isCompanyDemo(activeComp);
                const urlParams = new URLSearchParams(window.location.search);
                if (activeComp && activeComp.slug && !isCurrentDemo) {
                    urlParams.set('empresa', activeComp.slug);
                } else {
                    urlParams.delete('empresa');
                }
                const newQuery = urlParams.toString() ? '?' + urlParams.toString() : '';
                window.history.pushState({ view: 'store' }, '', '/' + newQuery);

                if (isCurrentDemo && !DemoTrialManager.isTrialActive()) {
                    setTimeout(() => {
                        openDemoLeadModal();
                    }, 350);
                }
            } catch (err) {}

            if (source === 'cardapio' || window.location.hash === '#cardapio') {
                setTimeout(() => {
                    const cardapioEl = document.getElementById('cardapio');
                    if (cardapioEl) cardapioEl.scrollIntoView({ behavior: 'smooth' });
                }, 60);
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }

        function switchToLandingView(e) {
            if (e && e.preventDefault) e.preventDefault();
            currentAppView = 'landing';
            updateAppViewDisplay();

            try {
                window.history.pushState({ view: 'landing' }, '', '/');
            } catch (err) {}

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function openAdminPanelFromLogin() {
            switchToStoreView('admin');
            openAdminPanel();
        }

        function logoutAdminFromLogin() {
            logoutAdmin();
            refreshDedicatedLoginUI();
        }

        // ========== GERENCIAMENTO DE ATALHOS E MODAIS ==========
        function handleDevLogoClick(e) {
            if (e) e.preventDefault();
        }

        // Tecla Esc para Modais
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const iconModal = document.getElementById('iconPickerModal');
                if (iconModal && iconModal.style.display === 'flex') {
                    closeIconPickerModal();
                }
            }
        });

        function openDevPasswordModal() {
            if (AuthManager.isSuperAdmin()) {
                openDevPanelModal();
                return;
            }
            const modal = document.getElementById('devPasswordModal');
            if (modal) {
                modal.classList.add('active');
                const input = document.getElementById('devPasswordInput');
                if (input) {
                    input.value = '';
                    setTimeout(() => input.focus(), 150);
                }
                const err = document.getElementById('devPasswordError');
                if (err) err.style.display = 'none';
            }
            if (window.location.pathname !== '/dev') {
                try {
                    history.pushState({ view: 'dev' }, '', '/dev');
                } catch (e) {}
            }
        }

        function closeDevPasswordModal() {
            const modal = document.getElementById('devPasswordModal');
            if (modal) modal.classList.remove('active');
            if (window.location.pathname === '/dev' || window.location.pathname === '/dev/') {
                try {
                    history.pushState({ view: 'store' }, '', '/');
                } catch (e) {}
            }
        }

        async function handleDevPasswordSubmit(e) {
            if (e) e.preventDefault();
            const inputEl = document.getElementById('devPasswordInput');
            const input = inputEl ? inputEl.value.trim() : '';
            const err = document.getElementById('devPasswordError');

            if (!input) {
                if (err) {
                    err.textContent = '❌ Por favor, digite a senha mestre de desenvolvedor.';
                    err.style.display = 'block';
                }
                return;
            }

            try {
                const response = await fetch('/api/auth/dev-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: input })
                });
                const res = await response.json();

                if (res && res.success) {
                    AuthManager.loginSuperAdmin(res.token);
                    closeDevPasswordModal();
                    openDevPanelModal();
                    showNotification('Acesso do Desenvolvedor autenticado! 🛠️', 'success');
                    return;
                }
            } catch (netErr) {
                console.error('Erro na autenticação dev:', netErr);
            }

            if (err) {
                err.textContent = '❌ Senha de Desenvolvedor incorreta! Verifique e tente novamente.';
                err.style.display = 'block';
            }
            if (inputEl) {
                inputEl.focus();
                inputEl.select();
            }
        }

        function openDevPanelModal() {
            if (!AuthManager.isSuperAdmin()) {
                openDevPasswordModal();
                return;
            }
            const modal = document.getElementById('devPanelModal');
            if (modal) modal.classList.add('active');
            if (window.location.pathname !== '/dev') {
                try {
                    history.pushState({ view: 'dev' }, '', '/dev');
                } catch (e) {}
            }
            renderDevCompanyList();
            fetchDevLeads(); // Carregar contatos da demo em segundo plano
            switchDevTab('companies');
        }

        function closeDevPanelModal() {
            const modal = document.getElementById('devPanelModal');
            if (modal) modal.classList.remove('active');
            if (window.location.pathname === '/dev' || window.location.pathname === '/dev/') {
                try {
                    history.pushState({ view: 'store' }, '', '/');
                } catch (e) {}
            }
        }

        function logoutDev() {
            AuthManager.logoutSuperAdmin();
            closeDevPanelModal();
            closeDevPasswordModal();
            if (window.location.pathname === '/dev' || window.location.pathname === '/dev/') {
                try {
                    history.pushState({ view: 'store' }, '', '/');
                } catch (e) {}
            }
            showNotification('Sessão de Desenvolvedor encerrada com sucesso.', 'info');
        }

        function switchToDevView(e) {
            if (e && e.preventDefault) e.preventDefault();
            if (window.location.pathname !== '/dev') {
                try {
                    history.pushState({ view: 'dev' }, '', '/dev');
                } catch (err) {}
            }
            if (AuthManager.isSuperAdmin()) {
                openDevPanelModal();
            } else {
                openDevPasswordModal();
            }
        }

        function switchDevTab(tab) {
            if (!AuthManager.isSuperAdmin()) {
                openDevPasswordModal();
                return;
            }
            const compTab = document.getElementById('devTabCompanies');
            const leadsTab = document.getElementById('devTabLeads');
            const custTab = document.getElementById('devTabCustomers');
            const migrateTab = document.getElementById('devTabMigrate');
            const createTab = document.getElementById('devTabCreate');
            const supTab = document.getElementById('devTabSupabase');
            const compBtn = document.getElementById('devTabCompaniesBtn');
            const leadsBtn = document.getElementById('devTabLeadsBtn');
            const custBtn = document.getElementById('devTabCustomersBtn');
            const migrateBtn = document.getElementById('devTabMigrateBtn');
            const createBtn = document.getElementById('devTabCreateBtn');
            const supBtn = document.getElementById('devTabSupabaseBtn');

            if (compTab) compTab.style.display = tab === 'companies' ? 'block' : 'none';
            if (leadsTab) leadsTab.style.display = tab === 'leads' ? 'block' : 'none';
            if (custTab) custTab.style.display = tab === 'customers' ? 'block' : 'none';
            if (migrateTab) migrateTab.style.display = tab === 'migrate' ? 'block' : 'none';
            if (createTab) createTab.style.display = tab === 'create' ? 'block' : 'none';
            if (supTab) supTab.style.display = tab === 'supabase' ? 'block' : 'none';

            if (compBtn) {
                compBtn.style.background = tab === 'companies' ? '#4F46E5' : 'var(--gray-200)';
                compBtn.style.color = tab === 'companies' ? 'white' : 'var(--gray-800)';
            }
            if (leadsBtn) {
                leadsBtn.style.background = tab === 'leads' ? '#4F46E5' : 'var(--gray-200)';
                leadsBtn.style.color = tab === 'leads' ? 'white' : 'var(--gray-800)';
            }
            if (custBtn) {
                custBtn.style.background = tab === 'customers' ? '#4F46E5' : 'var(--gray-200)';
                custBtn.style.color = tab === 'customers' ? 'white' : 'var(--gray-800)';
            }
            if (migrateBtn) {
                migrateBtn.style.background = tab === 'migrate' ? '#4F46E5' : 'var(--gray-200)';
                migrateBtn.style.color = tab === 'migrate' ? 'white' : 'var(--gray-800)';
            }
            if (createBtn) {
                createBtn.style.background = tab === 'create' ? '#4F46E5' : 'var(--gray-200)';
                createBtn.style.color = tab === 'create' ? 'white' : 'var(--gray-800)';
            }
            if (supBtn) {
                supBtn.style.background = tab === 'supabase' ? '#4F46E5' : 'var(--gray-200)';
                supBtn.style.color = tab === 'supabase' ? 'white' : 'var(--gray-800)';
            }

            if (tab === 'leads') {
                fetchDevLeads();
            } else if (tab === 'customers') {
                populateDevCustomerFilter();
                renderDevCustomerList();
            } else if (tab === 'migrate') {
                populateDevMigrateCompanySelect();
            } else if (tab === 'supabase') {
                updateSupabaseDevInfo();
            }
        }

        function populateDevMigrateCompanySelect() {
            const select = document.getElementById('devMigrateTargetCompany');
            if (!select) return;
            select.innerHTML = companies.map(comp => {
                const isCurrent = comp.id === activeCompanyId ? ' (Atual Ativa)' : '';
                return `<option value="${comp.id}" ${comp.id === activeCompanyId ? 'selected' : ''}>🏬 ${comp.name}${isCurrent}</option>`;
            }).join('');
        }

        // ========== IMPLANTAÇÃO E MIGRAÇÃO DE BANCO DE DADOS DE CLIENTES ==========
        function loadSampleMigrationData() {
            const input = document.getElementById('devMigrateDataInput');
            if (!input) return;
            input.value = `Nome; Telefone; Endereço; Senha\nRodrigo Rodrigues; 21973987378; Rua lavaquiel Biosque; 123456\nCamila Souza; 21988771122; Av. Atlântica 1500 apto 402, Copacabana; 123456\nCarlos Eduardo Santos; 21977665544; Rua das Palmeiras 88, Centro; 123456\nMariana Lima; 21999223344; Rua Bento Lisboa 45, Catete; 123456`;
            showNotification('Exemplo de dados carregado na área de texto.', 'info');
            previewMigrationData();
        }

        function downloadCustomerTemplateCSV() {
            const csvContent = "data:text/csv;charset=utf-8," + 
                "Nome;Telefone;Endereço;Senha\n" + 
                "Exemplo Cliente 1;21999990001;Rua das Flores 123;123\n" + 
                "Exemplo Cliente 2;21999990002;Av Central 456;123";
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "modelo_migracao_clientes.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function handleMigrationFileUpload(event) {
            const file = event.target.files && event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                const text = e.target.result;
                const input = document.getElementById('devMigrateDataInput');
                if (input) {
                    input.value = text;
                    showNotification(`Arquivo "${file.name}" carregado com sucesso!`, 'success');
                    previewMigrationData();
                }
            };
            reader.readAsText(file);
        }

        function parseRawMigrationData(rawText, defaultPwd) {
            if (!rawText || !rawText.trim()) return [];
            const text = rawText.trim();
            const results = [];

            // 1. Tentar parse como JSON Array
            if (text.startsWith('[') && text.endsWith(']')) {
                try {
                    const parsed = JSON.parse(text);
                    if (Array.isArray(parsed)) {
                        parsed.forEach(item => {
                            const name = item.name || item.nome || item.cliente || item.customerName || '';
                            const phone = String(item.phone || item.telefone || item.celular || item.whatsapp || '').replace(/[^0-9]/g, '');
                            const address = item.address || item.endereco || item.rua || '';
                            const password = item.password || item.senha || defaultPwd || '123';
                            if (phone && phone.length >= 8) {
                                results.push({
                                    name: name || 'Cliente Importado',
                                    phone: phone,
                                    address: address,
                                    password: password
                                });
                            }
                        });
                        return results;
                    }
                } catch(e) {}
            }

            // 2. Parse por Linhas (CSV, TSV, Ponto-e-Vírgula ou Vírgula)
            const lines = text.split(/\r?\n/);
            lines.forEach((line, idx) => {
                const cleanLine = line.trim();
                if (!cleanLine) return;

                // Ignorar cabeçalho se houver
                if (idx === 0 && (cleanLine.toLowerCase().includes('nome') || cleanLine.toLowerCase().includes('telefone') || cleanLine.toLowerCase().includes('phone'))) {
                    return;
                }

                // Detectar delimitador (; ou , ou \t ou |)
                let parts = [];
                if (cleanLine.includes(';')) {
                    parts = cleanLine.split(';');
                } else if (cleanLine.includes('\t')) {
                    parts = cleanLine.split('\t');
                } else if (cleanLine.includes('|')) {
                    parts = cleanLine.split('|');
                } else if (cleanLine.includes(',')) {
                    parts = cleanLine.split(',');
                } else {
                    parts = [cleanLine];
                }

                parts = parts.map(p => p.trim().replace(/^["']|["']$/g, ''));

                let name = '';
                let phone = '';
                let address = '';
                let password = defaultPwd || '123';

                if (parts.length >= 2) {
                    name = parts[0];
                    phone = parts[1].replace(/[^0-9]/g, '');
                    if (parts.length >= 3) address = parts[2];
                    if (parts.length >= 4 && parts[3]) password = parts[3];
                } else if (parts.length === 1) {
                    // Tentar extrair telefone se for linha única
                    const digits = parts[0].replace(/[^0-9]/g, '');
                    if (digits.length >= 8) {
                        phone = digits;
                        name = 'Cliente ' + digits.slice(-4);
                    }
                }

                if (phone && phone.length >= 8) {
                    results.push({
                        name: name || 'Cliente Importado',
                        phone: phone,
                        address: address,
                        password: password
                    });
                }
            });

            return results;
        }

        function previewMigrationData() {
            const rawText = document.getElementById('devMigrateDataInput')?.value || '';
            const defaultPwd = document.getElementById('devMigrateDefaultPassword')?.value || '123';
            const customers = parseRawMigrationData(rawText, defaultPwd);

            const previewArea = document.getElementById('devMigratePreviewArea');
            const validCountEl = document.getElementById('devMigrateValidCount');
            const listEl = document.getElementById('devMigratePreviewList');

            if (!previewArea || !listEl) return;

            if (customers.length === 0) {
                previewArea.style.display = 'block';
                validCountEl.textContent = '0';
                listEl.innerHTML = '<div style="color: #F87171; padding: 0.5rem;">⚠️ Nenhum registro válido encontrado. Verifique se os dados contêm pelo menos Nome e Telefone com DDD.</div>';
                return;
            }

            validCountEl.textContent = customers.length;
            previewArea.style.display = 'block';
            listEl.innerHTML = customers.map((c, i) => `
                <div style="background: #0F172A; padding: 0.35rem 0.6rem; border-radius: 6px; border: 1px solid #1E293B; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
                    <span><strong>#${i+1}</strong> ${c.name} (📱 ${c.phone})</span>
                    <span style="color: #94A3B8; font-size: 0.72rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">📍 ${c.address || 'Sem endereço'}</span>
                </div>
            `).join('');

            showNotification(`${customers.length} cliente(s) identificado(s) e prontos para implantação!`, 'info');
        }

        async function executeCustomerMigration() {
            const rawText = document.getElementById('devMigrateDataInput')?.value || '';
            const defaultPwd = document.getElementById('devMigrateDefaultPassword')?.value || '123';
            const targetCompanyId = document.getElementById('devMigrateTargetCompany')?.value;
            const accountType = document.getElementById('devMigrateAccountType')?.value || 'REGISTERED';

            const customers = parseRawMigrationData(rawText, defaultPwd);
            if (customers.length === 0) {
                showNotification('Cole ou carregue os dados dos clientes antes de executar a implantação.', 'warning');
                return;
            }

            const targetComp = companies.find(c => c.id === targetCompanyId) || settings;

            const confirmed = await showCustomConfirm({
                title: 'Confirmar Implantação de Clientes',
                message: `Deseja implantar ${customers.length} clientes na empresa "${targetComp.name || 'Empresa Selecionada'}"? O banco de dados local e isolado será atualizado instantaneamente.`,
                icon: '🚀',
                confirmText: 'Sim, Executar Implantação'
            });
            if (!confirmed) return;

            let addedCount = 0;
            let updatedCount = 0;

            customers.forEach(c => {
                const phone = c.phone;
                const existingIndex = customerAccounts.findIndex(a => a.phone === phone);

                if (accountType === 'REGISTERED') {
                    if (existingIndex >= 0) {
                        customerAccounts[existingIndex].name = c.name;
                        customerAccounts[existingIndex].address = c.address || customerAccounts[existingIndex].address;
                        customerAccounts[existingIndex].password = c.password || customerAccounts[existingIndex].password;
                        updatedCount++;
                    } else {
                        customerAccounts.push({
                            name: c.name,
                            phone: phone,
                            address: c.address,
                            password: c.password
                        });
                        addedCount++;
                    }
                }

                // Associar à empresa criando um registro de histórico inicial caso não tenha
                if (!targetComp.orders) targetComp.orders = [];
                const hasCompOrder = targetComp.orders.some(o => o.customerPhone === phone);
                if (!hasCompOrder && c.address) {
                    targetComp.orders.push({
                        id: 'MIG-' + Date.now().toString().slice(-4) + '-' + phone.slice(-4),
                        companyId: targetComp.id,
                        companyName: targetComp.name,
                        customerName: c.name,
                        customerPhone: phone,
                        customerAddress: c.address,
                        total: 0,
                        date: new Date().toLocaleDateString('pt-BR') + ' (Migração)',
                        items: [],
                        status: 'COMPLETED'
                    });
                }
            });

            localStorage.setItem('customerAccounts', JSON.stringify(customerAccounts));
            saveData();

            // Limpar formulário de implantação
            const input = document.getElementById('devMigrateDataInput');
            if (input) input.value = '';
            const previewArea = document.getElementById('devMigratePreviewArea');
            if (previewArea) previewArea.style.display = 'none';

            // Atualizar listas
            renderDevCustomerList();
            populateDevCustomerFilter();
            
            showNotification(`🎉 Implantação concluída com sucesso! ${addedCount} novos clientes inseridos, ${updatedCount} atualizados para "${targetComp.name}".`, 'success');
            
            // Trocar para a aba de clientes para conferir
            switchDevTab('customers');
            const filterEl = document.getElementById('devCustomerCompanyFilter');
            if (filterEl) {
                filterEl.value = targetCompanyId;
                renderDevCustomerList();
            }
        }

        function populateDevCustomerFilter() {
            const select = document.getElementById('devCustomerCompanyFilter');
            if (!select) return;
            const currentVal = select.value || 'ALL';
            let optionsHtml = '<option value="ALL">🌐 Todas as Empresas (Visão Global)</option>';
            companies.forEach(comp => {
                const isSelected = comp.id === currentVal ? 'selected' : '';
                optionsHtml += `<option value="${comp.id}" ${isSelected}>🏬 ${comp.name}</option>`;
            });
            select.innerHTML = optionsHtml;
        }

        function getAllCustomersUnified() {
            // Unifica clientes cadastrados formalmente (com senha/conta) e clientes de pedidos/entrega
            const map = new Map();

            // 1. Clientes com Cadastro formal
            (customerAccounts || []).forEach(acc => {
                if (!acc || !acc.phone) return;
                const phone = acc.phone.trim();
                map.set(phone, {
                    name: acc.name || 'Cliente',
                    phone: phone,
                    address: acc.address || 'Endereço não informado',
                    isRegistered: true,
                    registrationType: 'CADASTRO_COMPLETO',
                    hasPassword: !!acc.password,
                    orders: [],
                    associatedCompanies: new Set()
                });
            });

            // 2. Clientes temporários de entrega (customerData)
            if (customerData && customerData.phone) {
                const phone = customerData.phone.trim();
                if (!map.has(phone)) {
                    map.set(phone, {
                        name: customerData.name || 'Cliente',
                        phone: phone,
                        address: customerData.address || '',
                        isRegistered: false,
                        registrationType: 'DADOS_ENTREGA',
                        hasPassword: false,
                        orders: [],
                        associatedCompanies: new Set()
                    });
                }
            }

            // 3. Coletar pedidos de todas as empresas e associar aos clientes
            companies.forEach(comp => {
                const orders = comp.orders || [];
                orders.forEach(ord => {
                    if (!ord || !ord.customerPhone) return;
                    const phone = ord.customerPhone.trim();
                    let record = map.get(phone);
                    if (!record) {
                        record = {
                            name: ord.customerName || 'Cliente',
                            phone: phone,
                            address: ord.customerAddress || '',
                            isRegistered: false,
                            registrationType: 'DADOS_ENTREGA',
                            hasPassword: false,
                            orders: [],
                            associatedCompanies: new Set()
                        };
                        map.set(phone, record);
                    }
                    if (!record.orders.some(o => o.id === ord.id)) {
                        record.orders.push({
                            id: ord.id,
                            companyId: comp.id,
                            companyName: comp.name,
                            total: ord.total || 0,
                            date: ord.date || '',
                            itemsCount: ord.items?.length || 0,
                            status: ord.status || 'RECEIVED'
                        });
                    }
                    record.associatedCompanies.add(comp.id);
                    if (!record.address && ord.customerAddress) {
                        record.address = ord.customerAddress;
                    }
                });
            });

            // 4. Pedidos da lista geral customerOrders
            (customerOrders || []).forEach(ord => {
                if (!ord || !ord.customerPhone) return;
                const phone = ord.customerPhone.trim();
                const compId = ord.companyId || activeCompanyId || 'company-demo-don';
                const compObj = companies.find(c => c.id === compId) || settings;
                let record = map.get(phone);
                if (!record) {
                    record = {
                        name: ord.customerName || 'Cliente',
                        phone: phone,
                        address: ord.customerAddress || '',
                        isRegistered: false,
                        registrationType: 'DADOS_ENTREGA',
                        hasPassword: false,
                        orders: [],
                        associatedCompanies: new Set()
                    };
                    map.set(phone, record);
                }
                if (!record.orders.some(o => o.id === ord.id)) {
                    record.orders.push({
                        id: ord.id,
                        companyId: compId,
                        companyName: ord.companyName || compObj.name || 'Loja',
                        total: ord.total || 0,
                        date: ord.date || '',
                        itemsCount: ord.items?.length || 0,
                        status: ord.status || 'RECEIVED'
                    });
                }
                record.associatedCompanies.add(compId);
            });

            return Array.from(map.values());
        }

        function renderDevCustomerList() {
            const listEl = document.getElementById('devCustomerList');
            const totalBadge = document.getElementById('devCustomerCount');
            const metricTotal = document.getElementById('devMetricTotalCust');
            const metricReg = document.getElementById('devMetricRegisteredCust');
            const metricGuest = document.getElementById('devMetricGuestCust');
            const metricOrders = document.getElementById('devMetricTotalOrders');
            const filterComp = document.getElementById('devCustomerCompanyFilter')?.value || 'ALL';
            const searchTerm = (document.getElementById('devCustomerSearchInput')?.value || '').toLowerCase().trim();

            const allCustomers = getAllCustomersUnified();

            // Filtragem por Empresa
            let filtered = allCustomers;
            if (filterComp !== 'ALL') {
                filtered = filtered.filter(c => {
                    if (c.associatedCompanies.has(filterComp)) return true;
                    // Se o cliente ainda não fez pedido mas foi criado na sessão atual
                    return filterComp === activeCompanyId;
                });
            }

            // Filtragem por Termo de Busca
            if (searchTerm) {
                filtered = filtered.filter(c => 
                    (c.name && c.name.toLowerCase().includes(searchTerm)) ||
                    (c.phone && c.phone.includes(searchTerm)) ||
                    (c.address && c.address.toLowerCase().includes(searchTerm))
                );
            }

            // Atualização de Métricas
            const countTotal = filtered.length;
            const countReg = filtered.filter(c => c.isRegistered).length;
            const countGuest = filtered.filter(c => !c.isRegistered).length;
            const countOrders = filtered.reduce((acc, c) => acc + (c.orders ? c.orders.length : 0), 0);

            if (totalBadge) totalBadge.textContent = countTotal;
            if (metricTotal) metricTotal.textContent = countTotal;
            if (metricReg) metricReg.textContent = countReg;
            if (metricGuest) metricGuest.textContent = countGuest;
            if (metricOrders) metricOrders.textContent = countOrders;

            if (!listEl) return;

            if (filtered.length === 0) {
                listEl.innerHTML = `
                    <div style="text-align: center; padding: 2.5rem 1rem; color: var(--gray-600); background: #F8FAFC; border-radius: 8px; border: 1px dashed var(--gray-300);">
                        <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">👥</div>
                        <strong style="color: #1E293B; display: block; margin-bottom: 0.25rem;">Nenhum cliente encontrado</strong>
                        <small>Os clientes cadastrados ou que preencherem dados de entrega para esta empresa aparecerão aqui em tempo real.</small>
                    </div>
                `;
                return;
            }

            listEl.innerHTML = filtered.map(c => {
                const totalSpent = c.orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
                const compNames = Array.from(c.associatedCompanies).map(cid => {
                    const comp = companies.find(cp => cp.id === cid);
                    return comp ? comp.name : cid;
                });

                return `
                    <div style="background: white; border: 1.5px solid ${c.isRegistered ? '#BBF7D0' : '#FDE68A'}; border-radius: 10px; padding: 0.85rem 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.04); display: flex; flex-direction: column; gap: 0.5rem;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; flex-wrap: wrap;">
                            <div>
                                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                                    <strong style="font-size: 1rem; color: #0F172A;">👤 ${c.name}</strong>
                                    ${c.isRegistered ? `
                                        <span style="background: #DCFCE7; color: #15803D; font-size: 0.7rem; font-weight: 800; padding: 2px 8px; border-radius: 12px; border: 1px solid #86EFAC; display: inline-flex; align-items: center; gap: 0.2rem;">
                                            ✅ Cadastrado (Conta Ativa)
                                        </span>
                                    ` : `
                                        <span style="background: #FEF3C7; color: #B45309; font-size: 0.7rem; font-weight: 800; padding: 2px 8px; border-radius: 12px; border: 1px solid #FCD34D; display: inline-flex; align-items: center; gap: 0.2rem;">
                                            📋 Não Cadastrado (Apenas Dados de Entrega)
                                        </span>
                                    `}
                                </div>
                                <div style="font-size: 0.82rem; color: #475569; margin-top: 0.25rem; display: flex; gap: 0.85rem; flex-wrap: wrap;">
                                    <span>📱 Telefone: <strong style="color: #1E293B;">${c.phone}</strong></span>
                                    <span>📍 Endereço: <strong style="color: #1E293B;">${c.address || 'Não informado'}</strong></span>
                                </div>
                            </div>
                            <div style="text-align: right; font-size: 0.82rem; background: #F8FAFC; padding: 0.4rem 0.75rem; border-radius: 8px; border: 1px solid #E2E8F0;">
                                <div style="font-size: 0.72rem; color: #64748B; text-transform: uppercase; font-weight: 700;">Histórico de Compras</div>
                                <span style="font-weight: 800; color: #4F46E5;">📦 ${c.orders.length} pedido(s)</span>
                                ${totalSpent > 0 ? `<div style="font-weight: 700; color: #059669; font-size: 0.85rem;">R$ ${totalSpent.toFixed(2).replace('.', ',')}</div>` : ''}
                            </div>
                        </div>

                        <!-- Empresas Vinculadas & Ações Rápidas -->
                        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; border-top: 1px dashed #E2E8F0; padding-top: 0.5rem; font-size: 0.76rem; color: #64748B; flex-wrap: wrap;">
                            <div>
                                <span>🏬 Lojas Associadas: <strong>${compNames.length > 0 ? compNames.join(', ') : 'Geral'}</strong></span>
                            </div>
                            <div style="display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap;">
                                <a href="https://wa.me/${c.phone.replace(/[^0-9]/g, '')}" target="_blank" class="btn-admin" style="background: #25D366; color: white; padding: 0.25rem 0.6rem; font-size: 0.74rem; text-decoration: none; border-radius: 6px; display: inline-flex; align-items: center; gap: 0.2rem;" title="Conversar via WhatsApp">
                                    💬 WhatsApp
                                </a>
                                <button type="button" onclick="openEditCustomerByDev('${c.phone}')" class="btn-admin" style="background: #3B82F6; color: white; padding: 0.25rem 0.6rem; font-size: 0.74rem; border-radius: 6px; display: inline-flex; align-items: center; gap: 0.2rem;" title="Editar dados do cliente">
                                    ✏️ Editar
                                </button>
                                <button type="button" onclick="deleteCustomerByDev('${c.phone}')" class="btn-admin" style="background: #EF4444; color: white; padding: 0.25rem 0.6rem; font-size: 0.74rem; border-radius: 6px; display: inline-flex; align-items: center; gap: 0.2rem;" title="Excluir cadastro do cliente">
                                    🗑️ Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // ========== EDIÇÃO E EXCLUSÃO DE CLIENTES (PAINEL DEV) ==========
        function openEditCustomerByDev(phone) {
            const allCust = getAllCustomersUnified();
            const customer = allCust.find(c => c.phone === phone);
            if (!customer) {
                showNotification('Cliente não encontrado.', 'danger');
                return;
            }

            document.getElementById('devEditCustomerOldPhone').value = customer.phone;
            document.getElementById('devEditCustomerName').value = customer.name || '';
            document.getElementById('devEditCustomerPhone').value = customer.phone || '';
            document.getElementById('devEditCustomerAddress').value = customer.address || '';
            document.getElementById('devEditCustomerIsReg').value = customer.isRegistered ? 'true' : 'false';

            const account = customerAccounts.find(a => a.phone === customer.phone);
            document.getElementById('devEditCustomerPassword').value = (account && account.password) ? account.password : '123';

            const modal = document.getElementById('devEditCustomerModal');
            if (modal) modal.classList.add('active');
        }

        function closeDevEditCustomerModal() {
            const modal = document.getElementById('devEditCustomerModal');
            if (modal) modal.classList.remove('active');
        }

        function handleDevSaveEditCustomer(e) {
            if (e) e.preventDefault();
            const oldPhone = document.getElementById('devEditCustomerOldPhone').value.trim();
            const newName = document.getElementById('devEditCustomerName').value.trim();
            const newPhone = document.getElementById('devEditCustomerPhone').value.trim();
            const newAddress = document.getElementById('devEditCustomerAddress').value.trim();
            const isReg = document.getElementById('devEditCustomerIsReg').value === 'true';
            const newPassword = document.getElementById('devEditCustomerPassword').value.trim() || '123';

            if (!newName || !newPhone) {
                showNotification('Preencha o nome e o telefone do cliente.', 'warning');
                return;
            }

            // 1. Atualizar ou criar na lista de contas formais (customerAccounts)
            const accIndex = customerAccounts.findIndex(a => a.phone === oldPhone);
            if (isReg) {
                if (accIndex >= 0) {
                    customerAccounts[accIndex].name = newName;
                    customerAccounts[accIndex].phone = newPhone;
                    customerAccounts[accIndex].address = newAddress;
                    customerAccounts[accIndex].password = newPassword;
                } else {
                    customerAccounts.push({
                        name: newName,
                        phone: newPhone,
                        address: newAddress,
                        password: newPassword
                    });
                }
            } else {
                // Se desmarcado como cadastrado formal, remover de customerAccounts
                if (accIndex >= 0) {
                    customerAccounts.splice(accIndex, 1);
                }
            }
            localStorage.setItem('customerAccounts', JSON.stringify(customerAccounts));

            // 2. Atualizar dados da sessão ativa se for o mesmo cliente
            if (loggedCustomer && (loggedCustomer.phone === oldPhone || loggedCustomer.phone === newPhone)) {
                if (isReg) {
                    loggedCustomer.name = newName;
                    loggedCustomer.phone = newPhone;
                    loggedCustomer.address = newAddress;
                    loggedCustomer.password = newPassword;
                    localStorage.setItem('loggedCustomer', JSON.stringify(loggedCustomer));
                } else {
                    loggedCustomer = null;
                    localStorage.removeItem('loggedCustomer');
                }
                updateCustomerHeaderUI();
            }

            if (customerData && (customerData.phone === oldPhone || customerData.phone === newPhone)) {
                customerData.name = newName;
                customerData.phone = newPhone;
                customerData.address = newAddress;
                localStorage.setItem('customerData', JSON.stringify(customerData));
                renderCustomerForm();
            }

            // 3. Atualizar telefone/nome nos pedidos existentes
            companies.forEach(comp => {
                if (comp.orders) {
                    comp.orders.forEach(o => {
                        if (o.customerPhone === oldPhone) {
                            o.customerPhone = newPhone;
                            o.customerName = newName;
                            if (newAddress) o.customerAddress = newAddress;
                        }
                    });
                }
            });
            customerOrders.forEach(o => {
                if (o.customerPhone === oldPhone) {
                    o.customerPhone = newPhone;
                    o.customerName = newName;
                    if (newAddress) o.customerAddress = newAddress;
                }
            });
            saveData();

            closeDevEditCustomerModal();
            renderDevCustomerList();
            showNotification(`Cliente "${newName}" atualizado com sucesso! ✨`, 'success');
        }

        async function deleteCustomerByDev(phone) {
            const allCust = getAllCustomersUnified();
            const customer = allCust.find(c => c.phone === phone);
            const customerName = customer ? customer.name : phone;

            const confirmed = await showCustomConfirm({
                title: 'Excluir Cliente Definitivamente',
                message: `Deseja realmente remover de vez o cliente "${customerName}" (${phone})? Todas as contas, dados de entrega e histórico associado a este telefone serão excluídos definitivamente.`,
                icon: '🗑️',
                confirmText: 'Sim, Remover de Vez'
            });
            if (!confirmed) return;

            // 1. Remover de vez de customerAccounts
            customerAccounts = customerAccounts.filter(a => a.phone !== phone);
            localStorage.setItem('customerAccounts', JSON.stringify(customerAccounts));

            // 2. Limpar dados de sessão e formulário se for o cliente atual
            if (loggedCustomer && loggedCustomer.phone === phone) {
                loggedCustomer = null;
                localStorage.removeItem('loggedCustomer');
                updateCustomerHeaderUI();
            }
            if (customerData && customerData.phone === phone) {
                customerData = null;
                localStorage.removeItem('customerData');
                renderCustomerForm();
            }

            // 3. Remover de vez todos os pedidos associados a esse telefone em todas as empresas
            companies.forEach(comp => {
                if (comp.orders) {
                    comp.orders = comp.orders.filter(o => o.customerPhone !== phone);
                }
            });

            // 4. Remover da lista geral de customerOrders
            customerOrders = customerOrders.filter(o => o.customerPhone !== phone);

            // 5. Salvar estado persistente
            saveData();

            // 6. Atualizar UI
            renderDevCustomerList();
            renderCustomerOrdersList();
            showNotification(`Cliente "${customerName}" removido de vez com sucesso! 🗑️✨`, 'success');
        }

        function updateSupabaseDevInfo() {
            const activeComp = getActiveCompany();
            const nameEl = document.getElementById('supabaseActiveCompName');
            const idEl = document.getElementById('supabaseActiveCompId');
            if (nameEl) nameEl.textContent = activeComp.name || 'Don Food';
            if (idEl) idEl.textContent = `Tenant ID: ${activeCompanyId || 'company-demo-don'}`;

            // Checar status do backend
            fetch('/api/supabase/status')
                .then(r => r.json())
                .then(st => {
                    const badge = document.getElementById('supabaseStatusBadge');
                    if (badge) {
                        if (st.configured) {
                            badge.textContent = '🟢 SUPABASE CONECTADO (' + st.url + ')';
                            badge.style.background = '#10B981';
                        } else {
                            badge.textContent = '🔒 ISOLAMENTO ATIVO (MODO LOCAL/HÍBRIDO)';
                            badge.style.background = '#6366F1';
                        }
                    }
                })
                .catch(() => {});
        }

        async function syncCurrentCompanyToSupabaseUI() {
            const activeComp = getActiveCompany();
            const compId = activeCompanyId || 'company-demo-don';

            try {
                showNotification('Sincronizando dados com o Supabase...', 'info');
                const response = await fetch('/api/supabase/sync-company', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-company-id': compId
                    },
                    body: JSON.stringify({
                        companyId: compId,
                        company: {
                            id: compId,
                            name: activeComp.name,
                            email: activeComp.email,
                            whatsapp_number: activeComp.whatsappNumber,
                            logo_url: activeComp.logoUrl,
                            category: activeComp.presetType || 'acai'
                        },
                        settings: {
                            restaurant_name: settings.restaurantName || activeComp.name,
                            subtitle: settings.subtitle,
                            whatsapp_number: settings.whatsappNumber,
                            delivery_fee: settings.deliveryFee,
                            delivery_time: settings.deliveryTime,
                            is_open: settings.isOpen
                        },
                        products: products.map(p => ({
                            id: p.id,
                            name: p.name,
                            description: p.description,
                            price: p.price,
                            tag: p.tag,
                            image_url: p.image,
                            is_customizable: !!p.isCustomizable
                        })),
                        orders: customerOrders.map(o => ({
                            id: o.id,
                            customer_name: o.customerName || (o.customer && o.customer.name) || 'Cliente',
                            customer_phone: o.customerPhone || (o.customer && o.customer.phone) || '',
                            customer_address: o.address || (o.customer && o.customer.address) || '',
                            delivery_type: o.deliveryType || 'delivery',
                            payment_method: o.paymentMethod || 'pix',
                            items: o.items || [],
                            subtotal: o.subtotal || o.total || 0,
                            delivery_fee: o.deliveryFee || 0,
                            total: o.total || 0,
                            status: o.status || 'pending'
                        }))
                    })
                });

                const result = await response.json();
                if (response.ok) {
                    showNotification(`✓ Dados da empresa sincronizados no Supabase com isolamento de tenant!`, 'success');
                    alert(`✅ Sincronização Supabase Concluída!\n\nTenant: ${activeComp.name} (${compId})\nProdutos isolados: ${products.length}\nPedidos isolados: ${customerOrders.length}\n\nNenhuma outra empresa tem acesso a esses dados.`);
                } else {
                    alert(`ℹ️ Nota: ${result.error || 'Configure suas chaves SUPABASE_URL e SUPABASE_ANON_KEY no arquivo .env para conexão direta à nuvem. Os dados estão seguros e isolados localmente!'}`);
                }
            } catch (err) {
                alert(`ℹ️ O sistema está preparado para o Supabase com Row Level Security (RLS). Para conectar sua instância de produção, adicione suas credenciais no arquivo de variáveis de ambiente.`);
            }
        }

        async function downloadSupabaseSQL() {
            if (!AuthManager.isSuperAdmin()) {
                showNotification('Acesso restrito ao Super Administrador.', 'warning');
                openDevPasswordModal();
                return;
            }
            try {
                const token = AuthManager.getAuthToken();
                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
                const response = await fetch('/api/dev/supabase-schema', { headers });
                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'supabase_schema.sql';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                    showNotification('Download de supabase_schema.sql concluído! 📄', 'success');
                    return;
                }
            } catch (e) {
                console.error('Falha ao baixar schema SQL:', e);
            }
            showNotification('Não foi possível obter o script SQL.', 'warning');
        }

        function renderDevCompanyList() {
            if (!AuthManager.isSuperAdmin()) {
                return;
            }
            const container = document.getElementById('devCompanyList');
            const countBadge = document.getElementById('devCompanyCount');
            if (countBadge) countBadge.textContent = companies.length;

            if (!container) return;
            container.innerHTML = companies.map(comp => {
                const isActive = comp.id === activeCompanyId;
                const isDemo = comp.isDemo || comp.id === 'company-demo-don' || comp.slug === 'demo';
                const compEmail = comp.email || 'demo@donfood.com';
                const compSlug = getCompanySlug(comp);
                const officialUrl = getCompanyOfficialUrl(comp);
                const safePassword = comp.adminPassword || 'admin';

                return `
                    <div style="background: ${isActive ? '#EEF2FF' : '#F8FAFC'}; border: 1.5px solid ${isActive ? '#6366F1' : '#E2E8F0'}; border-radius: 10px; padding: 0.85rem 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap;">
                            <div>
                                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; flex-wrap: wrap;">
                                    <strong style="font-size: 0.95rem; color: #1E1B4B;">${comp.name}</strong>
                                    ${isActive ? '<span style="background: #4F46E5; color: white; font-size: 0.65rem; font-weight: bold; padding: 2px 6px; border-radius: 10px;">★ ATIVA</span>' : ''}
                                    ${isDemo ? '<span style="background: #EA580C; color: white; font-size: 0.65rem; font-weight: bold; padding: 2px 6px; border-radius: 10px;">✨ EMPRESA DEMO</span>' : ''}
                                </div>
                                <div style="font-size: 0.8rem; color: var(--gray-600); display: flex; gap: 0.8rem; flex-wrap: wrap; align-items: center;">
                                    <span>📧 E-mail: <strong>${compEmail}</strong></span>
                                    <span>📱 WhatsApp: <strong>${comp.whatsappNumber}</strong></span>
                                    <span style="display: inline-flex; align-items: center; gap: 4px; background: #F1F5F9; padding: 2px 6px; border-radius: 4px;">
                                        🔑 Senha: <strong id="compPassVal_${comp.id}" data-revealed="false">••••••••</strong>
                                        <button type="button" onclick="toggleCompanyPasswordVisibility('${comp.id}', '${safePassword}')" style="background: none; border: none; cursor: pointer; font-size: 0.85rem; padding: 0 2px;" title="Revelar/Ocultar Senha">👁️</button>
                                    </span>
                                    <span>📦 Itens: <strong>${comp.products?.length || 0}</strong></span>
                                </div>
                            </div>
                            <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
                                <button type="button" onclick="openEditCompanyByDev('${comp.id}')" class="btn-admin" style="background: #3B82F6; color: white; font-size: 0.75rem; padding: 0.35rem 0.65rem;">
                                    ✏️ Editar
                                </button>
                                ${!isActive ? `
                                    <button type="button" onclick="switchActiveCompany('${comp.id}')" class="btn-admin" style="background: #10B981; color: white; font-size: 0.75rem; padding: 0.35rem 0.65rem;">
                                        ✅ Ativar
                                    </button>
                                ` : ''}
                                ${!isDemo ? `
                                    <button type="button" onclick="deleteCompanyByDev('${comp.id}')" class="btn-admin" style="background: #EF4444; color: white; font-size: 0.75rem; padding: 0.35rem 0.65rem;">
                                        🗑️ Excluir
                                    </button>
                                ` : ''}
                            </div>
                        </div>

                        <!-- BARRA DE LINK OFICIAL DO SITE -->
                        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 6px; padding: 0.45rem 0.75rem; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; font-size: 0.78rem; flex-wrap: wrap;">
                            <div style="display: flex; align-items: center; gap: 0.4rem; font-family: monospace; color: #4F46E5; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                <span>🔗</span>
                                <span>${officialUrl}</span>
                            </div>
                            <div style="display: flex; gap: 0.35rem;">
                                <button type="button" onclick="copyCompanyLink('${compSlug}')" class="btn-admin" style="background: #EEF2FF; color: #4F46E5; border: 1px solid #C7D2FE; font-size: 0.72rem; padding: 0.25rem 0.55rem; font-weight: 600;">
                                    📋 Copiar Link
                                </button>
                                <button type="button" onclick="window.open('/?empresa=${compSlug}', '_blank')" class="btn-admin" style="background: #F1F5F9; color: #334155; border: 1px solid #CBD5E1; font-size: 0.72rem; padding: 0.25rem 0.55rem; font-weight: 600;">
                                    🚀 Testar Acesso
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        async function handleDevCreateCompany(e) {
            if (e) e.preventDefault();
            const name = document.getElementById('devNewCompName').value.trim();
            if (!name) return;

            const emailInput = document.getElementById('devNewCompEmail');
            const email = emailInput ? emailInput.value.trim() : `contato@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
            const slugInput = document.getElementById('devNewCompSlug');
            const slug = (slugInput && slugInput.value.trim()) ? sanitizeSlug(slugInput.value) : generateSlug(name);
            const subtitle = document.getElementById('devNewCompSubtitle').value.trim() || 'Delivery rápido e sabor inigualável!';
            const whatsapp = document.getElementById('devNewCompWhatsapp').value.trim() || '5521999999999';
            const instagram = document.getElementById('devNewCompInstagram')?.value.trim() || '';
            const cnpj = document.getElementById('devNewCompCnpj')?.value.trim() || '';
            const address = document.getElementById('devNewCompAddress')?.value.trim() || '';
            const password = document.getElementById('devNewCompPassword').value.trim() || 'admin123';
            const fee = parseFloat(document.getElementById('devNewCompFee').value) || 6.00;
            const deliveryTime = document.getElementById('devNewCompDeliveryTime')?.value.trim() || '30 - 45 min';
            const logo = document.getElementById('devNewCompLogo').value.trim() || '';
            const presetType = document.getElementById('devNewCompPreset').value;
            const themeKey = document.getElementById('devNewCompTheme').value;

            const newCompanyId = 'company-' + Date.now();
            const initialProducts = MENU_PRESETS[presetType] || MENU_PRESETS.acai;
            const initialTheme = THEME_PRESETS[themeKey] || THEME_PRESETS.acai;

            const newCompany = {
                id: newCompanyId,
                slug: slug,
                name: name,
                email: email,
                subtitle: subtitle,
                whatsappNumber: whatsapp,
                instagram: instagram,
                cnpj: cnpj,
                address: address,
                logoUrl: logo,
                adminPassword: password,
                deliveryFee: fee,
                deliveryTime: deliveryTime,
                presetType: presetType,
                schedule: defaultSettings.schedule,
                themeColors: initialTheme,
                products: initialProducts,
                orders: []
            };

            companies.push(newCompany);
            saveData();
            await syncCompaniesToServer();
            renderDevCompanyList();
            const officialUrl = getCompanyOfficialUrl(newCompany);
            alert(`🎉 Empresa "${name}" cadastrada com sucesso!\n\n🌐 Link Oficial Exclusivo:\n${officialUrl}\n\n📧 E-mail de Login: ${email}\n🔑 Senha: ${password}`);
            switchDevTab('companies');
        }

        async function deleteCompanyByDev(companyId) {
            if (companyId === 'company-demo-don') {
                showNotification('Não é permitido excluir a Empresa Demo principal.', 'warning');
                return;
            }
            const confirmed = await showCustomConfirm({
                title: 'Excluir Empresa',
                message: 'Tem certeza que deseja excluir esta empresa e todos os seus dados?',
                icon: '🏢',
                confirmText: 'Excluir Empresa',
                cancelText: 'Cancelar'
            });
            if (confirmed) {
                companies = companies.filter(c => c.id !== companyId);
                if (activeCompanyId === companyId) {
                    activeCompanyId = 'company-demo-don';
                }
                saveData();
                await syncCompaniesToServer();
                loadData();
                renderAll();
                renderDevCompanyList();
                showNotification('Empresa removida com sucesso! 🗑️', 'info');
            }
        }

        function openEditCompanyByDev(companyId) {
            const comp = companies.find(c => c.id === companyId);
            if (!comp) return;

            const idInput = document.getElementById('devEditCompId');
            const nameInput = document.getElementById('devEditCompName');
            const emailInput = document.getElementById('devEditCompEmail');
            const slugInput = document.getElementById('devEditCompSlug');
            const passwordInput = document.getElementById('devEditCompPassword');
            const whatsappInput = document.getElementById('devEditCompWhatsapp');
            const instagramInput = document.getElementById('devEditCompInstagram');
            const cnpjInput = document.getElementById('devEditCompCnpj');
            const addressInput = document.getElementById('devEditCompAddress');
            const subtitleInput = document.getElementById('devEditCompSubtitle');
            const feeInput = document.getElementById('devEditCompFee');
            const deliveryTimeInput = document.getElementById('devEditCompDeliveryTime');
            const logoInput = document.getElementById('devEditCompLogo');

            if (idInput) idInput.value = comp.id;
            if (nameInput) nameInput.value = comp.name || '';
            if (emailInput) emailInput.value = comp.email || 'donfim@gmail.com';
            if (slugInput) slugInput.value = comp.slug || getCompanySlug(comp);
            if (passwordInput) passwordInput.value = comp.adminPassword || 'admin123';
            if (whatsappInput) whatsappInput.value = comp.whatsappNumber || '';
            if (instagramInput) instagramInput.value = comp.instagram || '';
            if (cnpjInput) cnpjInput.value = comp.cnpj || '';
            if (addressInput) addressInput.value = comp.address || '';
            if (subtitleInput) subtitleInput.value = comp.subtitle || '';
            if (feeInput) feeInput.value = comp.deliveryFee !== undefined ? comp.deliveryFee : 6.00;
            if (deliveryTimeInput) deliveryTimeInput.value = comp.deliveryTime || '30 - 45 min';
            if (logoInput) logoInput.value = comp.logoUrl || '';

            const themeSelect = document.getElementById('devEditCompTheme');
            if (themeSelect) {
                if (comp.presetType && THEME_PRESETS[comp.presetType]) {
                    themeSelect.value = comp.presetType;
                } else if (comp.themeColors && comp.themeColors.primary) {
                    const primary = comp.themeColors.primary.toLowerCase();
                    if (primary.includes('59176b')) themeSelect.value = 'acai';
                    else if (primary.includes('dc2626')) themeSelect.value = 'fastfood';
                    else if (primary.includes('ea580c')) themeSelect.value = 'burguer';
                    else if (primary.includes('059669')) themeSelect.value = 'pizzaria';
                    else if (primary.includes('2563eb')) themeSelect.value = 'sorveteria';
                    else if (primary.includes('db2777')) themeSelect.value = 'confeitaria';
                    else if (primary.includes('1e1b4b')) themeSelect.value = 'darkgourmet';
                }
            }

            const modal = document.getElementById('devEditCompanyModal');
            if (modal) modal.classList.add('active');
        }

        function closeDevEditCompanyModal() {
            const modal = document.getElementById('devEditCompanyModal');
            if (modal) modal.classList.remove('active');
        }

        async function handleDevSaveEditCompany(e) {
            if (e) e.preventDefault();
            const companyId = document.getElementById('devEditCompId').value;
            const comp = companies.find(c => c.id === companyId);
            if (!comp) return;

            const name = document.getElementById('devEditCompName').value.trim();
            const email = document.getElementById('devEditCompEmail').value.trim();
            const slugInput = document.getElementById('devEditCompSlug');
            const slug = (slugInput && slugInput.value.trim()) ? sanitizeSlug(slugInput.value) : generateSlug(name);
            const password = document.getElementById('devEditCompPassword').value.trim();
            const whatsapp = document.getElementById('devEditCompWhatsapp').value.trim();
            const instagram = document.getElementById('devEditCompInstagram')?.value.trim() || '';
            const cnpj = document.getElementById('devEditCompCnpj')?.value.trim() || '';
            const address = document.getElementById('devEditCompAddress')?.value.trim() || '';
            const subtitle = document.getElementById('devEditCompSubtitle').value.trim();
            const fee = parseFloat(document.getElementById('devEditCompFee').value) || 0;
            const deliveryTime = document.getElementById('devEditCompDeliveryTime')?.value.trim() || '30 - 45 min';
            const logo = document.getElementById('devEditCompLogo').value.trim();
            const themeKey = document.getElementById('devEditCompTheme').value;

            if (!name || !email || !password || !whatsapp) {
                alert('Por favor, preencha todos os campos obrigatórios (*)');
                return;
            }

            comp.name = name;
            comp.email = email;
            comp.slug = slug;
            comp.adminPassword = password;
            comp.whatsappNumber = whatsapp;
            comp.instagram = instagram;
            comp.cnpj = cnpj;
            comp.address = address;
            comp.subtitle = subtitle;
            comp.deliveryFee = fee;
            comp.deliveryTime = deliveryTime;
            comp.logoUrl = logo;

            if (THEME_PRESETS[themeKey]) {
                comp.themeColors = { ...THEME_PRESETS[themeKey] };
                comp.presetType = themeKey;
            }

            if (companyId === activeCompanyId) {
                settings.restaurantName = name;
                settings.email = email;
                settings.slug = slug;
                settings.adminPassword = password;
                settings.whatsappNumber = whatsapp;
                settings.subtitle = subtitle;
                settings.deliveryFee = fee;
                settings.deliveryTime = deliveryTime;
                settings.logoUrl = logo;
                if (THEME_PRESETS[themeKey]) {
                    settings.themeColors = { ...THEME_PRESETS[themeKey] };
                    applyThemeColors(settings.themeColors);
                }
                renderAll();
            }

            saveData();
            await syncCompaniesToServer();
            renderDevCompanyList();
            closeDevEditCompanyModal();
            showNotification(`Cadastro da empresa "${name}" atualizado com sucesso! ✏️✨`, 'success');
        }

        function renderAll() {
            renderProducts();
            renderProductAdminList();
            renderSettings();
            renderActiveCompanySelectUI();
            renderAdminCouponsList();
            renderAdminNeighborhoodsList();
            updateCartUI();
            updateSiteSettings();
            updateCustomerHeaderUI();
            renderAdminOrdersList();
            renderCustomerOrdersList();
            renderDynamicPromoBanner();
            renderDynamicIngredientsSection();
            updateMenuSubtitle();
            renderPresetCatalog();
            updateAppViewDisplay();
        }

        // ========== RENDERIZAR CONFIGURAÇÕES ==========
        let currentAdminExtrasChips = [];

        function renderSettings() {
            const activeComp = getActiveCompany();
            document.getElementById('restaurantName').value = settings.restaurantName || '';
            
            const slugInput = document.getElementById('restaurantSlug');
            if (slugInput) {
                slugInput.value = settings.slug || activeComp.slug || getCompanySlug(activeComp);
                slugInput.dataset.manualEdit = '';
            }

            if (document.getElementById('companyEmail')) {
                document.getElementById('companyEmail').value = settings.email || 'donfim@gmail.com';
            }
            document.getElementById('logoUrl').value = settings.logoUrl || '';
            document.getElementById('restaurantSubtitle').value = settings.subtitle || '';
            updateAdminShareLinkDisplay();
            if (document.getElementById('restaurantInstagram')) {
                document.getElementById('restaurantInstagram').value = settings.instagram || '';
            }
            if (document.getElementById('restaurantCnpj')) {
                document.getElementById('restaurantCnpj').value = settings.cnpj || '';
            }
            if (document.getElementById('restaurantAddress')) {
                document.getElementById('restaurantAddress').value = settings.address || '';
            }
            document.getElementById('whatsappNumber').value = settings.whatsappNumber || '';
            document.getElementById('adminPassword').value = settings.adminPassword || 'admin123';
            document.getElementById('deliveryFee').value = settings.deliveryFee || 6.00;
            if (document.getElementById('deliveryTime')) {
                document.getElementById('deliveryTime').value = settings.deliveryTime || '30 - 45 min';
            }
            
            const catSelect = document.getElementById('companyCategorySelect');
            if (catSelect) catSelect.value = getActiveCompanyPresetType();

            // Carregar dados no formulário do Banner Promocional
            const presetKey = getActiveCompanyPresetType();
            const defaultPromo = PROMO_PRESETS[presetKey] || PROMO_PRESETS.acai;
            const promo = settings.customBanner || defaultPromo;

            const bannerEnabledEl = document.getElementById('promoBannerEnabled');
            if (bannerEnabledEl) bannerEnabledEl.checked = promo.enabled !== false;

            const badgeEl = document.getElementById('promoBannerBadge');
            if (badgeEl) badgeEl.value = promo.badge || defaultPromo.badge || '';

            const titleEl = document.getElementById('promoBannerTitle');
            if (titleEl) titleEl.value = promo.title || defaultPromo.title || '';

            const subEl = document.getElementById('promoBannerSubtitle');
            if (subEl) subEl.value = promo.subtitle || defaultPromo.subtitle || '';

            const footEl = document.getElementById('promoBannerFooter');
            if (footEl) footEl.value = promo.footerNote || defaultPromo.footerNote || '';

            const cards = promo.cards || defaultPromo.cards || [];
            if (document.getElementById('promoCard1Icon')) document.getElementById('promoCard1Icon').value = cards[0]?.icon || '';
            if (document.getElementById('promoCard1Title')) document.getElementById('promoCard1Title').value = cards[0]?.title || '';
            if (document.getElementById('promoCard1Desc')) document.getElementById('promoCard1Desc').value = cards[0]?.desc || '';

            if (document.getElementById('promoCard2Icon')) document.getElementById('promoCard2Icon').value = cards[1]?.icon || '';
            if (document.getElementById('promoCard2Title')) document.getElementById('promoCard2Title').value = cards[1]?.title || '';
            if (document.getElementById('promoCard2Desc')) document.getElementById('promoCard2Desc').value = cards[1]?.desc || '';

            if (document.getElementById('promoCard3Icon')) document.getElementById('promoCard3Icon').value = cards[2]?.icon || '';
            if (document.getElementById('promoCard3Title')) document.getElementById('promoCard3Title').value = cards[2]?.title || '';
            if (document.getElementById('promoCard3Desc')) document.getElementById('promoCard3Desc').value = cards[2]?.desc || '';

            // Carregar dados na Seção de Acompanhamentos
            const defaultExtras = EXTRAS_PRESETS[presetKey] || EXTRAS_PRESETS.acai;
            const extras = settings.customExtras || defaultExtras;

            const extrasEnabledEl = document.getElementById('extrasSectionEnabled');
            if (extrasEnabledEl) extrasEnabledEl.checked = extras.enabled !== false;

            const extrasBadgeEl = document.getElementById('extrasSectionBadge');
            if (extrasBadgeEl) extrasBadgeEl.value = extras.badge !== undefined ? extras.badge : (defaultExtras.badge || '');

            const extrasTitleEl = document.getElementById('extrasSectionTitle');
            if (extrasTitleEl) extrasTitleEl.value = extras.title !== undefined ? extras.title : (defaultExtras.title || '');

            const extrasDescEl = document.getElementById('extrasSectionDesc');
            if (extrasDescEl) extrasDescEl.value = extras.desc !== undefined ? extras.desc : (defaultExtras.desc || '');

            const extrasFreeLimitEl = document.getElementById('extrasFreeLimit');
            if (extrasFreeLimitEl) extrasFreeLimitEl.value = extras.freeLimit !== undefined ? extras.freeLimit : (settings.freeAccompanimentsLimit || 3);

            if (extras.categories && Array.isArray(extras.categories) && extras.categories.length > 0) {
                currentAdminExtrasCategories = JSON.parse(JSON.stringify(extras.categories));
            } else if (extras.chips && Array.isArray(extras.chips)) {
                currentAdminExtrasCategories = [{
                    name: extras.categoryName || (defaultExtras.categories && defaultExtras.categories[0] ? defaultExtras.categories[0].name : 'Acompanhamentos'),
                    chips: JSON.parse(JSON.stringify(extras.chips))
                }];
            } else if (defaultExtras.categories && Array.isArray(defaultExtras.categories)) {
                currentAdminExtrasCategories = JSON.parse(JSON.stringify(defaultExtras.categories));
            } else {
                currentAdminExtrasCategories = [{
                    name: '🍳 Acompanhamentos e Adicionais',
                    chips: [
                        { icon: '✨', name: 'Item Padrão', price: '' }
                    ]
                }];
            }

            renderAdminExtrasCategoriesEditor();

            // Renderizar horários e paleta de cores
            renderSchedule();
            applyThemeColors(settings.themeColors);
        }

        function renderSchedule() {
            const days = {
                monday: 'Segunda-feira',
                tuesday: 'Terça-feira',
                wednesday: 'Quarta-feira',
                thursday: 'Quinta-feira',
                friday: 'Sexta-feira',
                saturday: 'Sábado',
                sunday: 'Domingo'
            };

            scheduleGrid.innerHTML = Object.keys(days).map(day => {
                const schedule = settings.schedule?.[day] || { enabled: true, open: '09:00', close: '22:00' };
                return `
                    <div class="schedule-day">
                        <div class="schedule-day-name">
                            <input type="checkbox" class="schedule-checkbox" id="schedule-${day}-enabled" ${schedule.enabled ? 'checked' : ''}>
                            <label for="schedule-${day}-enabled" style="margin-left: 0.5rem; cursor: pointer;">${days[day]}</label>
                        </div>
                        <input type="time" class="schedule-time-input" id="schedule-${day}-open" value="${schedule.open}" ${!schedule.enabled ? 'disabled' : ''}>
                        <input type="time" class="schedule-time-input" id="schedule-${day}-close" value="${schedule.close}" ${!schedule.enabled ? 'disabled' : ''}>
                    </div>
                `;
            }).join('');

            // Adicionar listeners para habilitar/desabilitar inputs
            Object.keys(days).forEach(day => {
                const checkbox = document.getElementById(`schedule-${day}-enabled`);
                const openInput = document.getElementById(`schedule-${day}-open`);
                const closeInput = document.getElementById(`schedule-${day}-close`);
                
                checkbox.addEventListener('change', () => {
                    openInput.disabled = !checkbox.checked;
                    closeInput.disabled = !checkbox.checked;
                });
            });
        }

        function updateSiteSettings() {
            // Atualizar nome do restaurante no header
            document.getElementById('headerRestaurantName').textContent = settings.restaurantName;
            
            const logoIcon = document.getElementById('logoIcon');
            const heroLogo = document.getElementById('heroLogo');
            const heroRestaurantName = document.getElementById('heroRestaurantName');
            
            // Atualizar a Logo do Header e do Hero dinamicamente
            if (settings.logoUrl && settings.logoUrl.trim() !== '') {
                // Configurações do Header
                logoIcon.innerHTML = `<img src="${settings.logoUrl}" alt="${settings.restaurantName}" onerror="if(this.src.indexOf('Logo_Don.png') === -1) { this.src = '/Logo_Don.png'; }">`;
                logoIcon.style.background = 'transparent';

                // Configurações do Hero (Imagem redonda com o nome da empresa abaixo)
                heroLogo.src = settings.logoUrl;
                heroLogo.alt = settings.restaurantName;
                heroLogo.onerror = function() {
                    if (this.src.indexOf('Logo_Don.png') === -1) {
                        this.src = '/Logo_Don.png';
                    }
                };
                heroLogo.style.display = 'block'; // Mostra a imagem
                heroRestaurantName.textContent = settings.restaurantName;
                heroRestaurantName.style.display = 'block'; // Mostra o nome da empresa abaixo da logo
            } else {
                // Caso não tenha logoUrl definida
                logoIcon.innerHTML = '';
                logoIcon.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';

                heroLogo.style.display = 'none';
                heroRestaurantName.textContent = settings.restaurantName;
                heroRestaurantName.style.display = 'block'; // Mostra o texto H1
            }

            document.getElementById('heroSubtitle').textContent = settings.subtitle;
            
            // Atualizar Previsão de Entrega no Hero e no Carrinho
            const delTimeStr = settings.deliveryTime || '30 - 45 min';
            const heroTimeEl = document.getElementById('heroDeliveryTimeText');
            if (heroTimeEl) heroTimeEl.textContent = delTimeStr;

            const cartTimeEl = document.getElementById('cartEstimatedTime');
            if (cartTimeEl) cartTimeEl.textContent = delTimeStr;

            // Atualizar status (verificar horário atual)
            updateStoreStatus();
            
            // Atualizar WhatsApp
            const whatsappUrl = `https://wa.me/${settings.whatsappNumber}`;
            document.getElementById('whatsappBtn').href = whatsappUrl;
            document.getElementById('whatsappFab').href = whatsappUrl;

            // Atualizar Instagram Dinamicamente
            const instagramFabEl = document.getElementById('instagramFab');
            if (instagramFabEl) {
                const activeComp = (typeof companies !== 'undefined' && companies.find(c => c.id === activeCompanyId)) || settings;
                const isDemo = activeComp.isDemo || activeComp.slug === 'demo' || activeComp.id === 'company-demo-don';
                const igVal = (settings.instagram || '').trim();
                if (!isDemo && igVal) {
                    const cleanIg = igVal.replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '').trim();
                    if (cleanIg) {
                        instagramFabEl.href = `https://instagram.com/${cleanIg}`;
                        instagramFabEl.style.display = (currentAppView === 'landing' || currentAppView === 'login') ? 'none' : 'flex';
                    } else {
                        instagramFabEl.style.display = 'none';
                    }
                } else {
                    instagramFabEl.style.display = 'none';
                    instagramFabEl.href = '#';
                }
            }
            
            // Atualizar card hero com produto de destaque (Gourmet & Alta Conversão)
            const featuredProduct = products.find(p => p.name.toLowerCase().includes('barca') || p.name.toLowerCase().includes('burger') || p.name.toLowerCase().includes('duplo') || p.name.toLowerCase().includes('pizza')) || products.find(p => p.available);
            if (featuredProduct) {
                const isCustom = featuredProduct.isCustomizable || (featuredProduct.name || '').toLowerCase().includes('açaí') || (featuredProduct.name || '').toLowerCase().includes('barca');
                const descText = featuredProduct.description || '';
                const hasLongDesc = descText.length > 35;
                document.getElementById('heroCard').innerHTML = `
                    <div style="position: absolute; top: 10px; right: 10px; background: linear-gradient(135deg, #F59E0B 0%, #EA580C 100%); color: #FFFFFF; font-weight: 800; font-size: 0.68rem; padding: 3px 10px; border-radius: 50px; box-shadow: 0 3px 10px rgba(234, 88, 12, 0.4); z-index: 2; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid rgba(255,255,255,0.4);">
                        🔥 Mais Pedido!
                    </div>
                    <div class="hero-card-img-wrap">
                        <img src="${featuredProduct.image}" alt="${featuredProduct.name}" onerror="this.onerror=null; this.src='super_barca.svg';">
                    </div>
                    <h3>${featuredProduct.name}</h3>
                    <p class="collapsed" id="heroCardDesc" onclick="toggleHeroDescription()" title="Clique para expandir ou recolher a descrição">${descText}</p>
                    ${hasLongDesc ? `
                    <div class="hero-desc-toggle-btn" id="heroDescToggleBtn" onclick="toggleHeroDescription()" title="Clique para expandir ou recolher a descrição">
                        <span id="heroDescToggleText">Ver mais</span> <span id="heroDescToggleIcon">▾</span>
                    </div>` : ''}
                    <div class="hero-card-footer">
                        <div>
                            <span style="font-size: 0.62rem; color: #FED7AA; text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 2px;">Valor Especial</span>
                            <div class="hero-card-price">R$ ${featuredProduct.price.toFixed(2).replace('.', ',')}</div>
                        </div>
                        <button type="button" onclick="${isCustom ? `openAcaiCustomizer(${featuredProduct.id})` : `addToCart(${featuredProduct.id})`}" class="btn-admin" style="background: linear-gradient(135deg, #F59E0B 0%, #EA580C 100%); color: #FFFFFF; font-weight: 800; font-size: 0.8rem; padding: 0.52rem 1.05rem; border-radius: 50px; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.4); display: inline-flex; align-items: center; gap: 0.35rem; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.04)';" onmouseout="this.style.transform='scale(1)';">
                            ${isCustom ? '⚡ Personalizar' : '🛒 Quero Esse'}
                        </button>
                    </div>
                `;
            }
        }

        function toggleHeroDescription() {
            const p = document.getElementById('heroCardDesc');
            if (!p) return;
            const toggleText = document.getElementById('heroDescToggleText');
            const toggleIcon = document.getElementById('heroDescToggleIcon');
            const isCollapsed = p.classList.contains('collapsed');
            
            if (isCollapsed) {
                p.classList.remove('collapsed');
                p.classList.add('expanded');
                p.setAttribute('title', 'Clique para recolher a descrição');
                if (toggleText) toggleText.textContent = 'Recolher';
                if (toggleIcon) toggleIcon.textContent = '▴';
            } else {
                p.classList.remove('expanded');
                p.classList.add('collapsed');
                p.setAttribute('title', 'Clique para ver a descrição completa');
                if (toggleText) toggleText.textContent = 'Ver mais';
                if (toggleIcon) toggleIcon.textContent = '▾';
            }
        }

        function updateStoreStatus() {
            const now = new Date();
            const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const currentDay = dayNames[now.getDay()];
            const currentTime = now.getHours() * 60 + now.getMinutes(); // minutos desde meia-noite

            const todaySchedule = settings.schedule?.[currentDay];
            
            let isOpen = false;
            if (todaySchedule && todaySchedule.enabled) {
                const [openHour, openMin] = todaySchedule.open.split(':').map(Number);
                const [closeHour, closeMin] = todaySchedule.close.split(':').map(Number);
                const openTime = openHour * 60 + openMin;
                const closeTime = closeHour * 60 + closeMin;
                
                isOpen = currentTime >= openTime && currentTime <= closeTime;
            }

            const statusBadge = document.getElementById('statusBadge');
            const statusText = document.getElementById('statusText');
            
            if (isOpen) {
                statusBadge.className = 'status-badge status-open';
                statusText.textContent = 'Aberto Agora';
            } else {
                statusBadge.className = 'status-badge status-closed';
                statusText.textContent = 'Fechado';
            }
        }

        // ========== RENDERIZAR PRODUTOS ==========
        function renderProducts() {
            const safeProducts = DefensiveUtils.safeArray(products);
            if (safeProducts.length === 0) {
                productsGrid.innerHTML = '<p style="text-align: center; color: var(--gray-600); grid-column: 1/-1;">Nenhum produto cadastrado ainda.</p>';
                return;
            }
            
            const presetKey = getActiveCompanyPresetType();

            productsGrid.innerHTML = safeProducts.map(product => {
                if (!product) return '';
                let isCustomizable = false;
                if (product.isCustomizable === false || product.isAcai === false) {
                    isCustomizable = false;
                } else if (product.isCustomizable === true || product.isAcai === true) {
                    isCustomizable = true;
                } else {
                    const lowerName = (product.name || '').toLowerCase();
                    isCustomizable = lowerName.includes('açaí') || lowerName.includes('barca') || lowerName.includes('copo') || lowerName.includes('marmita') || lowerName.includes('combo') || lowerName.includes('quentinha');
                }

                const badgeHtml = !product.available 
                    ? '<span class="product-badge">Esgotado</span>' 
                    : (product.tag 
                        ? `<span class="product-badge" style="background:#EAB308; color:#000; font-weight:800; border: 1px solid #CA8A04;">${DefensiveUtils.escapeHtml(product.tag)}</span>` 
                        : (isCustomizable ? '<span class="product-badge" style="background:var(--primary);">Acompanhamentos</span>' : ''));

                const price = DefensiveUtils.safeNumber(product.price, 0);
                const cleanName = DefensiveUtils.escapeHtml(product.name || 'Produto');
                const cleanDesc = DefensiveUtils.escapeHtml(product.description || '');
                const cleanImg = DefensiveUtils.escapeHtml(product.image || 'acai_300ml.svg');

                const hasDesc = cleanDesc.trim().length > 0;
                const hasLongDesc = cleanDesc.trim().length > 25;
                const descHtml = hasDesc ? `
                    <p class="product-description collapsed" id="prodDesc_${product.id}" onclick="toggleProductDescription('${product.id}', event)" title="Clique para expandir ou recolher a descrição">${cleanDesc}</p>
                    ${hasLongDesc ? `
                    <div class="product-desc-toggle-btn" id="prodDescToggleBtn_${product.id}" onclick="toggleProductDescription('${product.id}', event)" title="Clique para expandir ou recolher a descrição">
                        <span id="prodDescToggleText_${product.id}">Ver mais</span> <span id="prodDescToggleIcon_${product.id}">▾</span>
                    </div>` : ''}
                ` : '<p class="product-description empty"></p>';

                return `
                <div class="product-card">
                    <img src="${cleanImg}" alt="${cleanName}" class="product-image" onerror="this.onerror=null; this.src='acai_300ml.svg';">
                    ${badgeHtml}
                    <div class="product-info">
                        <h3 class="product-name">${cleanName}</h3>
                        ${descHtml}
                        <div class="product-footer">
                            <span class="product-price">${DefensiveUtils.formatCurrency(price)}</span>
                            <button 
                                class="btn-add-cart" 
                                onclick="${isCustomizable ? `openAcaiCustomizer(${product.id})` : `addToCart(${product.id})`}"
                                ${!product.available ? 'disabled' : ''}
                            >
                                ${!product.available ? 'Indisponível' : (isCustomizable ? '⚡ Monte do Seu Jeito' : '+ Adicionar')}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            }).join('');
        }

        function toggleProductDescription(productId, event) {
            if (event && event.stopPropagation) {
                event.stopPropagation();
            }
            const p = document.getElementById(`prodDesc_${productId}`);
            if (!p) return;
            const toggleText = document.getElementById(`prodDescToggleText_${productId}`);
            const toggleIcon = document.getElementById(`prodDescToggleIcon_${productId}`);
            const isExpanded = p.classList.contains('expanded');
            
            if (isExpanded) {
                p.classList.remove('expanded');
                p.classList.add('collapsed');
                p.setAttribute('title', 'Clique para ver a descrição completa');
                if (toggleText) toggleText.textContent = 'Ver mais';
                if (toggleIcon) toggleIcon.textContent = '▾';
            } else {
                p.classList.remove('collapsed');
                p.classList.add('expanded');
                p.setAttribute('title', 'Clique para recolher a descrição');
                if (toggleText) toggleText.textContent = 'Recolher';
                if (toggleIcon) toggleIcon.textContent = '▴';
            }
        }

        function getProductFreeLimit(product) {
            if (!product) return 3;
            if (product.allowFreeAccompaniments === false) return 0;
            if (product.freeAccompanimentsLimit !== undefined && product.freeAccompanimentsLimit !== null && product.freeAccompanimentsLimit !== '') {
                const parsed = parseInt(product.freeAccompanimentsLimit, 10);
                return isNaN(parsed) ? 3 : Math.max(0, parsed);
            }
            if (settings.customExtras && settings.customExtras.freeLimit !== undefined && settings.customExtras.freeLimit !== '') {
                const parsed = parseInt(settings.customExtras.freeLimit, 10);
                return isNaN(parsed) ? 3 : Math.max(0, parsed);
            }
            if (settings.freeAccompanimentsLimit !== undefined && settings.freeAccompanimentsLimit !== '') {
                const parsed = parseInt(settings.freeAccompanimentsLimit, 10);
                return isNaN(parsed) ? 3 : Math.max(0, parsed);
            }
            return 3;
        }

        // ========== INTERACTIVE PRODUCT CUSTOMIZER (POR CATEGORIA) ==========
        function openAcaiCustomizer(productId) {
            const activeComp = (typeof companies !== 'undefined' && companies.find(c => c.id === activeCompanyId)) || settings;
            const isCurrentDemo = isCompanyDemo(activeComp);
            if (isCurrentDemo && !DemoTrialManager.isTrialActive()) {
                openDemoLeadModal();
                showNotification('📱 Digite seu número para liberar o cardápio e testar a montagem por 24h!', 'info');
                return;
            }

            const product = products.find(p => p.id === productId);
            if (!product || !product.available) return;

            activeCustomizingProduct = product;
            selectedIngredients = [];

            const freeLimit = getProductFreeLimit(product);
            const presetKey = getActiveCompanyPresetType();
            let titlePrefix = "Monte seu";
            let subtitleText = freeLimit > 0
                ? `${freeLimit} acompanhamentos grátis inclusos no valor (R$ ${product.price.toFixed(2).replace('.', ',')})`
                : `Escolha os acompanhamentos e adicionais da sua preferência (R$ ${product.price.toFixed(2).replace('.', ',')})`;

            if (presetKey === 'marmitaria') {
                titlePrefix = "Monte sua";
            } else if (presetKey === 'pizzaria') {
                titlePrefix = "Personalize sua";
            } else if (presetKey === 'burguer') {
                titlePrefix = "Customize seu";
            } else if (presetKey === 'confeitaria') {
                titlePrefix = "Personalize seu";
            } else if (presetKey === 'sorveteria') {
                titlePrefix = "Monte seu";
            }

            document.getElementById('customizerModalTitle').textContent = `${titlePrefix} ${product.name}`;
            document.getElementById('customizerModalSubtitle').textContent = subtitleText;

            renderCustomizerBody();
            updateCustomizerPrice();

            document.getElementById('acaiCustomizerModal').classList.add('active');
        }

        function closeAcaiCustomizer() {
            document.getElementById('acaiCustomizerModal').classList.remove('active');
        }

        function renderCustomizerBody() {
            const container = document.getElementById('customizerModalBody');
            const ingredientsList = getIngredientsForActiveCompany();
            const freeLimit = getProductFreeLimit(activeCustomizingProduct);
            
            let html = `
                <div class="customizer-counter-box" id="customizerCounterBox">
                    <span class="customizer-counter-text">✨ Acompanhamentos Escolhidos:</span>
                    <span class="customizer-counter-badge" id="customizerFreeCount">0/${freeLimit} Grátis</span>
                </div>
                <div id="customizerAlertBox" class="customizer-alert-banner warning" style="display: none;"></div>
            `;

            ingredientsList.forEach((cat, catIdx) => {
                html += `<div class="customizer-cat-heading">${cat.category}</div>`;
                cat.items.forEach((item, itemIdx) => {
                    const itemId = `ing_${catIdx}_${itemIdx}`;
                    const isPaid = item.price > 0;
                    html += `
                        <label class="customizer-item-checkbox" for="${itemId}">
                            <div class="customizer-item-label">
                                <input type="checkbox" id="${itemId}" value="${item.name}" data-price="${item.price}" onchange="onIngredientToggle(this)">
                                <span>${item.name}</span>
                            </div>
                            <span class="customizer-item-tag ${isPaid ? 'paid' : ''}">${item.tag}</span>
                        </label>
                    `;
                });
            });

            container.innerHTML = html;
        }

        function onIngredientToggle(checkbox) {
            const name = checkbox.value;
            const price = parseFloat(checkbox.getAttribute('data-price')) || 0;
            const isFree = price === 0;
            const freeLimit = getProductFreeLimit(activeCustomizingProduct);
            const currentFreeCount = selectedIngredients.filter(i => i.price === 0).length;

            if (checkbox.checked) {
                // Se for um item grátis e o cliente já atingiu o limite de grátis permitidos
                if (isFree && freeLimit > 0 && currentFreeCount >= freeLimit) {
                    checkbox.checked = false; // Bloqueia a seleção!

                    // Exibir alerta sonoro/notificação
                    showNotification(`🛑 Limite de ${freeLimit} acompanhamentos grátis atingido! Desmarque um item para escolher outro.`, 'warning');

                    const alertEl = document.getElementById('customizerAlertBox');
                    if (alertEl) {
                        alertEl.className = 'customizer-alert-banner warning';
                        alertEl.style.display = 'flex';
                        alertEl.innerHTML = `<span>🛑</span><span>Limite de <strong>${freeLimit} acompanhamentos grátis</strong> atingido! Desmarque um item para selecionar outro.</span>`;
                    }
                    return;
                }

                selectedIngredients.push({ name, price });

                // Se acabou de atingir o limite de grátis
                const newFreeCount = selectedIngredients.filter(i => i.price === 0).length;
                if (isFree && freeLimit > 0 && newFreeCount === freeLimit) {
                    showNotification(`✨ Você selecionou os ${freeLimit} acompanhamentos grátis permitidos!`, 'success');
                    const alertEl = document.getElementById('customizerAlertBox');
                    if (alertEl) {
                        alertEl.className = 'customizer-alert-banner success';
                        alertEl.style.display = 'flex';
                        alertEl.innerHTML = `<span>✅</span><span>Você atingiu o limite de <strong>${freeLimit}/${freeLimit} acompanhamentos grátis</strong>! Seleções grátis adicionais foram bloqueadas.</span>`;
                    }
                }
            } else {
                selectedIngredients = selectedIngredients.filter(i => i.name !== name);
                const freeCountNow = selectedIngredients.filter(i => i.price === 0).length;
                const alertEl = document.getElementById('customizerAlertBox');
                if (alertEl && freeCountNow < freeLimit) {
                    alertEl.style.display = 'none';
                }
            }

            updateCustomizerPrice();
        }

        function updateCustomizerPrice() {
            if (!activeCustomizingProduct) return;

            const freeLimit = getProductFreeLimit(activeCustomizingProduct);
            const freeItems = selectedIngredients.filter(i => i.price === 0);
            const paidItems = selectedIngredients.filter(i => i.price > 0);
            const freeCount = freeItems.length;

            const badgeEl = document.getElementById('customizerFreeCount');
            if (badgeEl) {
                badgeEl.textContent = `${freeCount}/${freeLimit} Grátis`;
                if (freeLimit > 0 && freeCount >= freeLimit) {
                    badgeEl.classList.add('limit-reached');
                } else {
                    badgeEl.classList.remove('limit-reached');
                }
            }

            // Atualiza o estado visual dos checkboxes grátis não selecionados quando o limite for atingido
            const allCheckboxes = document.querySelectorAll('#customizerModalBody input[type="checkbox"]');
            allCheckboxes.forEach(cb => {
                const itemPrice = parseFloat(cb.getAttribute('data-price')) || 0;
                const parentLabel = cb.closest('.customizer-item-checkbox');
                if (itemPrice === 0 && freeLimit > 0 && freeCount >= freeLimit && !cb.checked) {
                    if (parentLabel) parentLabel.classList.add('disabled-free');
                } else {
                    if (parentLabel) parentLabel.classList.remove('disabled-free');
                }
            });

            let paidSum = paidItems.reduce((acc, curr) => acc + curr.price, 0);
            let total = activeCustomizingProduct.price + paidSum;

            const priceEl = document.getElementById('customizerTotalPrice');
            if (priceEl) {
                priceEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
            }
        }

        function confirmAcaiCustomization() {
            if (!activeCustomizingProduct) return;

            const freeItems = selectedIngredients.filter(i => i.price === 0);
            const paidItems = selectedIngredients.filter(i => i.price > 0);

            const paidSum = paidItems.reduce((acc, curr) => acc + curr.price, 0);
            const finalUnitPrice = activeCustomizingProduct.price + paidSum;

            const ingNames = selectedIngredients.map(i => i.name).join(', ') || 'Sem acompanhamentos selecionados';

            const cartItem = {
                id: Date.now(),
                productId: activeCustomizingProduct.id,
                name: `${activeCustomizingProduct.name}`,
                details: ingNames,
                price: finalUnitPrice,
                image: activeCustomizingProduct.image,
                quantity: 1
            };

            cart.push(cartItem);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
            triggerCartShake();

            closeAcaiCustomizer();
            showNotification('Item customizado adicionado ao carrinho!', 'success');
            
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
        }

        // ========== CATÁLOGOS PRONTOS 1-CLIQUE EXCLUSIVOS POR EMPRESA/CATEGORIA ==========
        const PRESET_CATALOGS_BY_CATEGORY = {
            acai: [
                { id: 'p1', name: 'Super Barca de Açaí', tag: '🔥 O MAIS PEDIDO!', description: 'Super Barca Recheada! Acompanha Kiwi, Banana, Cereais, Chocolate Flakes, Granulado, Cremes Especiais e Wafer + 3 acompanhamentos grátis.', price: 34.99, image: 'super_barca.svg', isAcai: true, isCustomizable: true },
                { id: 'p2', name: 'Açaí 300ML Tradicional', tag: '⚡ MAIS VENDIDO', description: 'Direito a 3 ingredientes grátis! (Ex: 1 Fruta + 1 Calda + 1 Cereal, ou como preferir).', price: 18.99, image: 'acai_300ml.svg', isAcai: true, isCustomizable: true },
                { id: 'p3', name: 'Açaí 400ML (Na Quentinha)', tag: '⭐ ESPECIAL DO FB', description: 'Açaí na Quentinha! Direito a 3 ingredientes grátis (Ex: 1 Fruta + 1 Calda + 1 Cereal).', price: 18.99, image: 'acai_quentinha.svg', isAcai: true, isCustomizable: true },
                { id: 'p4', name: 'Açaí 500ML Copo Gourmet', tag: '🍇 GRANDE', description: 'Copo caprichado de 500ML com direito a 3 acompanhamentos grátis à sua escolha.', price: 22.90, image: 'acai_300ml.svg', isAcai: true, isCustomizable: true },
                { id: 'p5', name: 'Açaí Vulcão de Nutella 700ML', tag: '🍫 PURA TENTAÇÃO', description: 'Vulcão de Nutella cremosa com açaí gelado, Ninho e morango fresco + 3 ingredientes grátis.', price: 29.90, image: 'super_barca.svg', isAcai: true, isCustomizable: true },
                { id: 'p6', name: 'Copo da Felicidade (Ninho + Nutella)', tag: '😍 FAVORITO', description: 'Camadas generosas de açaí, Nutella pura, Leite Ninho e Morango fatiado.', price: 24.90, image: 'acai_300ml.svg', isAcai: true, isCustomizable: true },
                { id: 'p7', name: 'Nutella Cremosa (Adicional)', tag: '🍫 ADICIONAL', description: 'Porção generosa de Nutella pura e cremosa.', price: 4.00, image: 'super_barca.svg', isAcai: false, isCustomizable: false },
                { id: 'p8', name: 'Leite em Pó Ninho (Adicional)', tag: '🥛 ADICIONAL', description: 'Porção extra de Leite em Pó Ninho original.', price: 3.00, image: 'leite_ninho.svg', isAcai: false, isCustomizable: false },
                { id: 'p9', name: 'Morango Fresco Fatiado', tag: '🍓 FRUTA', description: 'Morangos selecionados e fatiados na hora.', price: 3.00, image: 'super_barca.svg', isAcai: false, isCustomizable: false },
                { id: 'p10', name: 'Banana Caramelizada', tag: '🍌 DOCE', description: 'Banana caramelizada caseira com calda especial.', price: 3.00, image: 'acai_quentinha.svg', isAcai: false, isCustomizable: false },
                { id: 'p11', name: 'KitKat Crocante', tag: '🍫 CHOCOLATE', description: 'Barra de KitKat em pedaços crocantes.', price: 3.50, image: 'super_barca.svg', isAcai: false, isCustomizable: false },
                { id: 'p12', name: 'Confetes M&M\'s / Jujubas', tag: '🍬 CROCANTE', description: 'Confetes coloridos e jujubas macias.', price: 2.50, image: 'super_barca.svg', isAcai: false, isCustomizable: false },
                { id: 'p13', name: 'Refrigerante Coca-Cola 350ml', tag: '🥤 BEBIDA', description: 'Lata 350ml trincando de gelada.', price: 6.00, image: 'acai_300ml.svg', isAcai: false, isCustomizable: false },
                { id: 'p14', name: 'Guaraná Antarctica 350ml', tag: '🥤 BEBIDA', description: 'Lata 350ml geladinha.', price: 5.50, image: 'acai_300ml.svg', isAcai: false, isCustomizable: false },
                { id: 'p15', name: 'Água Mineral 500ml', tag: '💧 BEBIDA', description: 'Garrafa 500ml com ou sem gás.', price: 3.00, image: 'acai_300ml.svg', isAcai: false, isCustomizable: false }
            ],
            burguer: [
                { id: 'bg1', name: 'Combo X-Burguer Artesanal Duplo', tag: '🔥 O MAIS PEDIDO!', description: 'Blend duplo 160g, cheddar cremoso, bacon crocante + Batata Frita + Refri', price: 32.90, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&fit=crop', isAcai: false, isCustomizable: true },
                { id: 'bg2', name: 'Smash Burguer Bacon Especial', tag: '⚡ NOVIDADE', description: '2 carnes smash 80g, cheddar fatiado, bacon e maionese artesanal defumada', price: 24.90, image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&fit=crop', isAcai: false, isCustomizable: true },
                { id: 'bg3', name: 'Chicken Burguer Crocante', tag: '🍗 FRANGO', description: 'Sobrecoxa empanada super crocante, alface americana e maionese verde', price: 22.90, image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&fit=crop', isAcai: false, isCustomizable: true },
                { id: 'bg4', name: 'Batata Frita com Cheddar e Bacon (300g)', tag: '🍟 ACOMPANHAMENTO', description: 'Batata crocante coberta com molho cheddar e bacon em cubinhos', price: 18.00, image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&fit=crop', isAcai: false, isCustomizable: false },
                { id: 'bg5', name: 'Onion Rings Crocantes (10un)', tag: '🧅 ACOMPANHAMENTO', description: 'Anéis de cebola empanados e fritos, servidos com molho barbecue', price: 16.00, image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&fit=crop', isAcai: false, isCustomizable: false },
                { id: 'bg6', name: 'Milkshake de Nutella e Ninho 400ml', tag: '🥤 SOBREMESA', description: 'Milkshake cremoso de sorvete de baunilha com Nutella e Ninho', price: 17.90, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&fit=crop', isAcai: false, isCustomizable: false },
                { id: 'bg7', name: 'Refrigerante Lata 350ml', tag: '🥤 BEBIDA', description: 'Coca-Cola, Guaraná Antarctica ou Sprite geladinhos', price: 6.00, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&fit=crop', isAcai: false, isCustomizable: false }
            ],
            pizzaria: [
                { id: 'pz1', name: 'Pizza Grande Calabresa Especial', tag: '🔥 CAMPEÃO DE VENDAS', description: 'Massa artesanal, molho de tomate fresco, calabresa fatiada, cebola roxa e azeitonas', price: 45.00, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&fit=crop', isAcai: false, isCustomizable: true },
                { id: 'pz2', name: 'Pizza Quatro Queijos Cremosa', tag: '🧀 ESPECIAL', description: 'Mussarela, catupiry original, provolone e gorgonzola com orégano fresco', price: 48.00, image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?w=500&fit=crop', isAcai: false, isCustomizable: true },
                { id: 'pz3', name: 'Pizza Portuguesa Tradicional', tag: '🍕 CLÁSSICA', description: 'Mussarela, presunto fatiado, ovos, cebola, ervilha e azeitonas pretas', price: 46.00, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&fit=crop', isAcai: false, isCustomizable: true },
                { id: 'pz4', name: 'Pizza Brotinho Nutella com Morango', tag: '🍫 DOCE', description: 'Massa fina recheada com Nutella pura e morangos fatiados', price: 28.00, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&fit=crop', isAcai: false, isCustomizable: true },
                { id: 'pz5', name: 'Borda Recheada de Catupiry ou Cheddar', tag: '🧀 ADICIONAL', description: 'Borda vulcão recheada na hora para sua pizza grande', price: 8.00, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&fit=crop', isAcai: false, isCustomizable: false },
                { id: 'pz6', name: 'Guaraná Antarctica 2 Litros', tag: '🥤 BEBIDA', description: 'Refrigerante 2L trincando de gelado', price: 12.00, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&fit=crop', isAcai: false, isCustomizable: false }
            ],
            marmitaria: [
                { id: 'mt1', name: 'Marmita Executiva Bife Acebolado', tag: '⭐ TRADICIONAL', description: 'Bife acebolado macio, arroz soltinho, feijão caseiro, farofa crocante e salada', price: 22.00, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&fit=crop', isAcai: false, isCustomizable: true },
                { id: 'mt2', name: 'Marmita Feijoada Completa', tag: '🔥 SEXTA & SÁBADO', description: 'Feijoada saborosa com carne seca, costelinha e calabresa + couve, farofa e laranja', price: 26.00, image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&fit=crop', isAcai: false, isCustomizable: true },
                { id: 'mt3', name: 'Marmita Frango Grelhado Fit', tag: '🥗 SAUDÁVEL', description: 'Filé de frango grelhado bem temperado, arroz integral, feijão e legumes no vapor', price: 21.00, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&fit=crop', isAcai: false, isCustomizable: true },
                { id: 'mt4', name: 'Marmita Strogonoff de Carne Cremoso', tag: '🍲 DELÍCIA', description: 'Strogonoff de carne macia, arroz branco e batata palha super crocante', price: 24.00, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&fit=crop', isAcai: false, isCustomizable: true },
                { id: 'mt5', name: 'Suco Natural de Laranja 500ml', tag: '🥤 BEBIDA', description: 'Suco 100% natural feito na hora sem açúcar', price: 8.00, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&fit=crop', isAcai: false, isCustomizable: false }
            ],
            confeitaria: [
                { id: 'cf1', name: 'Torta Holandesa de Chocolate (Fatia)', tag: '🍰 SUPREMO', description: 'Fatia de torta holandesa com creme de baunilha e ganache meio amargo', price: 14.90, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&fit=crop', isAcai: false, isCustomizable: true },
                { id: 'cf2', name: 'Bolo de Pote Ninho com Nutella', tag: '🧁 FAVORITO', description: 'Pão de ló fofinho intercalado com creme ninho e recheio de Nutella pura', price: 12.00, image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&fit=crop', isAcai: false, isCustomizable: true },
                { id: 'cf3', name: 'Caixa de Brigadeiros Gourmet (6 un)', tag: '🍫 DOCE FINO', description: 'Brigadeiros belga artesanais enrolados com confeitos crocantes', price: 18.00, image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&fit=crop', isAcai: false, isCustomizable: false },
                { id: 'cf4', name: 'Fatia de Red Velvet com Cream Cheese', tag: '✨ ELEGANTE', description: 'Massa aveludada vermelha com recheio cremoso de cream cheese artesanal', price: 15.90, image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500&fit=crop', isAcai: false, isCustomizable: true }
            ],
            sorveteria: [
                { id: 'sv1', name: 'Taça Sundae de Morango e Chantilly', tag: '🍨 ESPECIAL', description: 'Sorvete cremoso com bastante calda de morango, chantilly e castanhas', price: 18.90, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&fit=crop', isAcai: false, isCustomizable: true },
                { id: 'sv2', name: 'Copão de Sorvete Artesanal 2 Bolas', tag: '🍦 REFRESCANTE', description: 'Escolha 2 sabores cremosos com direito a 2 coberturas à sua escolha', price: 14.00, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&fit=crop', isAcai: false, isCustomizable: true },
                { id: 'sv3', name: 'Pote de Sorvete 1 Litro (Sabores Variados)', tag: '📦 FAMÍLIA', description: 'Pote de 1L com sorvete ultra cremoso para saborear em casa', price: 28.00, image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&fit=crop', isAcai: false, isCustomizable: false }
            ],
            fastfood: [
                { id: 'ff1', name: 'Combo Smash Burger + Batata + Refri', tag: '🔥 SUPER COMBO', description: 'Smash burger duplo com cheddar, porção de batata frita e Coca-Cola lata', price: 29.90, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&fit=crop', isAcai: false, isCustomizable: true },
                { id: 'ff2', name: 'Hot Dog Prensado Especial Duplo', tag: '🌭 RÁPIDO', description: 'Duas salsichas, milho, ervilha, queijo ralado, batata palha e maionese da casa', price: 16.00, image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=500&fit=crop', isAcai: false, isCustomizable: true },
                { id: 'ff3', name: 'Porção de Batata Frita Crocante (250g)', tag: '🍟 ACOMPANHAMENTO', description: 'Batata palito bem crocante com sal e sachês de maionese e ketchup', price: 12.00, image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&fit=crop', isAcai: false, isCustomizable: false }
            ],
            darkgourmet: [
                { id: 'dg1', name: 'Picanha Angus Grelhada com Aligot', tag: '🥩 GASTRONOMIA NOBRE', description: 'Corte nobre de picanha Angus selada na parrilla, acompanhada de aligot de queijo', price: 68.00, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&fit=crop', isAcai: false, isCustomizable: true },
                { id: 'dg2', name: 'Risoto de Cogumelos Trufados', tag: '🍄 EXCLUSIVO', description: 'Arroz arbóreo cremoso com cogumelos variados e azeite de trufas brancas', price: 54.00, image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=500&fit=crop', isAcai: false, isCustomizable: true },
                { id: 'dg3', name: 'Petit Gâteau de Chocolate com Sorvete', tag: '🍮 SOBREMESA', description: 'Bolo quente com recheio cremoso acompanhado de sorvete de baunilha e calda', price: 24.00, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&fit=crop', isAcai: false, isCustomizable: false }
            ]
        };

        function getPresetCatalogForActiveCompany() {
            const presetKey = getActiveCompanyPresetType();
            return PRESET_CATALOGS_BY_CATEGORY[presetKey] || PRESET_CATALOGS_BY_CATEGORY.acai;
        }

        function renderPresetCatalog(filterText = '') {
            const grid = document.getElementById('presetCatalogGrid');
            if (!grid) return;

            const currentCatalog = DefensiveUtils.safeArray(getPresetCatalogForActiveCompany());
            const filterLower = (filterText || '').toLowerCase().trim();
            const filtered = currentCatalog.filter(p => {
                if (!p) return false;
                const name = (p.name || '').toLowerCase();
                const desc = (p.description || '').toLowerCase();
                const tag = (p.tag || '').toLowerCase();
                return name.includes(filterLower) || desc.includes(filterLower) || tag.includes(filterLower);
            });

            if (filtered.length === 0) {
                grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--gray-600); font-size: 0.85rem; padding: 1rem;">Nenhum produto encontrado na listagem pronta desta categoria.</p>';
                return;
            }

            const currentProducts = DefensiveUtils.safeArray(products);
            grid.innerHTML = filtered.map(item => {
                const itemName = (item.name || '').toLowerCase().trim();
                const alreadyAdded = currentProducts.some(p => p && (p.name || '').toLowerCase().trim() === itemName);
                const price = DefensiveUtils.safeNumber(item.price, 0);
                const cleanName = DefensiveUtils.escapeHtml(item.name || 'Item');
                const cleanDesc = DefensiveUtils.escapeHtml(item.description || '');
                const cleanImg = DefensiveUtils.escapeHtml(item.image || 'acai_300ml.svg');
                const itemId = DefensiveUtils.escapeHtml(item.id || '');

                return `
                    <div class="preset-card">
                        <div>
                            <img src="${cleanImg}" alt="${cleanName}" onerror="this.onerror=null; this.src='acai_300ml.svg';">
                            <div class="preset-card-title">${cleanName}</div>
                            <div class="preset-card-desc">${cleanDesc}</div>
                        </div>
                        <div class="preset-card-footer">
                            <span class="preset-card-price">${DefensiveUtils.formatCurrency(price)}</span>
                            <button 
                                type="button" 
                                class="btn-add-preset ${alreadyAdded ? 'added' : ''}" 
                                onclick="addPresetToProducts('${itemId}')"
                            >
                                ${alreadyAdded ? '✓ Adicionado' : '➕ Inserir'}
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function addPresetToProducts(presetId) {
            const currentCatalog = getPresetCatalogForActiveCompany();
            const item = currentCatalog.find(p => p.id === presetId);
            if (!item) return;

            const newProduct = {
                id: Date.now(),
                name: item.name,
                tag: item.tag || '',
                description: item.description,
                price: item.price,
                image: item.image,
                available: true,
                isAcai: !!item.isAcai
            };

            products.push(newProduct);
            saveData();
            renderAll();
            renderPresetCatalog(document.getElementById('presetSearchInput')?.value || '');
            showNotification(`"${item.name}" adicionado ao cardápio com sucesso! 🛒`, 'success');
        }

        // ========== MOSTRAR E OCULTAR SENHA (GLOBAL) ==========
        function togglePasswordVisibility(inputId, btnElement) {
            const input = document.getElementById(inputId);
            if (!input) return;

            if (input.type === 'password') {
                input.type = 'text';
                if (btnElement) {
                    btnElement.textContent = '🙈';
                    btnElement.setAttribute('title', 'Ocultar senha');
                    btnElement.setAttribute('aria-label', 'Ocultar senha');
                }
            } else {
                input.type = 'password';
                if (btnElement) {
                    btnElement.textContent = '👁️';
                    btnElement.setAttribute('title', 'Mostrar senha');
                    btnElement.setAttribute('aria-label', 'Mostrar senha');
                }
            }
        }

        // ========== AUTH & HEADER ADMIN (RBAC: COMPANY_OWNER) ==========
        let isAdminLoggedIn = false;

        function openAdminPanel() {
            const activeComp = (typeof companies !== 'undefined' && companies.find(c => c.id === activeCompanyId)) || settings;
            const isCurrentDemo = isCompanyDemo(activeComp);
            if (isCurrentDemo && !AuthManager.isSuperAdmin()) {
                openDemoAdminBlockedModal();
                return;
            }
            if (!AuthManager.isCompanyOwner(activeCompanyId)) {
                openAdminLogin();
                return;
            }
            if (adminPanel) adminPanel.classList.add('active');
            if (adminOverlay) adminOverlay.classList.add('active');
            renderPresetCatalog();
        }

        function openAdminLogin() {
            const activeComp = (typeof companies !== 'undefined' && companies.find(c => c.id === activeCompanyId)) || settings;
            const isCurrentDemo = isCompanyDemo(activeComp);
            if (isCurrentDemo && !AuthManager.isSuperAdmin()) {
                openDemoAdminBlockedModal();
                return;
            }
            const modal = document.getElementById('passwordModal');
            if (modal) modal.classList.add('active');
            const emailInput = document.getElementById('companyLoginEmail');
            
            if (emailInput) {
                emailInput.value = '';
            }
            if (passwordInput) passwordInput.value = '';
            if (passwordError) passwordError.style.display = 'none';

            setTimeout(() => {
                if (emailInput) {
                    emailInput.focus();
                } else if (passwordInput) {
                    passwordInput.focus();
                }
            }, 100);
        }

        function loginAdminSuccess(targetComp = null, token = null) {
            const comp = targetComp || companies.find(c => c.id === activeCompanyId) || settings;
            AuthManager.loginCompanyOwner(comp, token);
            const modal = document.getElementById('passwordModal');
            if (modal) modal.classList.remove('active');
            openAdminPanel();
            updateAdminHeaderUI();
            showNotification(`Login de empresa realizado com sucesso! 🏬✨ (${comp.name || 'Loja'})`, 'success');
        }

        function logoutAdmin() {
            AuthManager.logoutCompanyOwner();
        }

        function updateAdminHeaderUI() {
            const container = document.getElementById('adminHeaderContainer');
            const cartBtn = document.getElementById('cartBtn');
            const btnAcquireHeader = document.getElementById('btnAcquireHeader');
            const mobileMenu = document.getElementById('mobileHeaderMenuContainer');

            const activeComp = (typeof companies !== 'undefined' && companies.find(c => c.id === activeCompanyId)) || settings;
            const isCurrentDemo = isCompanyDemo(activeComp);

            if (currentAppView === 'landing' || currentAppView === 'login') {
                if (container) {
                    container.style.display = 'none';
                    container.innerHTML = '';
                }
                if (cartBtn) cartBtn.style.display = 'none';
                if (btnAcquireHeader) btnAcquireHeader.style.display = 'none';
                if (mobileMenu) mobileMenu.style.display = 'none';
                return;
            }

            if (cartBtn) cartBtn.style.display = 'flex';
            if (mobileMenu) mobileMenu.style.display = '';

            if (btnAcquireHeader) {
                btnAcquireHeader.style.display = isCurrentDemo ? 'inline-flex' : 'none';
                if (isCurrentDemo) btnAcquireHeader.textContent = 'Quero Testar';
            }

            if (container) {
                if (loggedCustomer) {
                    // Quando logado como cliente, não exibir a parte de login de empresa
                    container.innerHTML = '';
                    container.style.display = 'none';
                } else if (AuthManager.isCompanyOwner(activeCompanyId) || AuthManager.isSuperAdmin()) {
                    container.style.display = 'flex';
                    const allOrders = typeof getActiveCompanyOrders === 'function' ? getActiveCompanyOrders() : customerOrders;
                    // Filtrar apenas pedidos ativos (pedidos com status 'COMPLETED'/Entregue ou 'CANCELLED' saem da lista)
                    const activeOrders = allOrders.filter(o => o && o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
                    const activeCount = activeOrders.length;
                    const hasNewBadge = activeCount > 0;
                    const roleLabel = AuthManager.isSuperAdmin() ? 'SUPER ADMIN' : 'LOJA';

                    container.innerHTML = `
                        <div class="admin-header-pill-group">
                            <span class="admin-logged-store-badge" title="${escapeHtml(activeComp.name || settings.restaurantName)} (${roleLabel})">
                                <span style="font-size: 0.65rem; background: ${AuthManager.isSuperAdmin() ? '#7C3AED' : '#4F46E5'}; color: white; padding: 1px 5px; border-radius: 6px; margin-right: 4px; font-weight: 800;">${roleLabel}</span>
                                <strong>${escapeHtml(activeComp.name || settings.restaurantName)}</strong>
                            </span>
                            <div class="admin-bell-dropdown-wrapper" id="adminBellDropdownWrapper">
                                <button type="button" class="admin-header-bell-btn ${hasNewBadge ? 'has-new' : ''}" id="adminHeaderBellBtn" onclick="toggleAdminOrdersDropdown(event)" title="${activeCount} pedido(s) em andamento">
                                    ${activeCount > 0 ? `<strong>${activeCount}</strong>` : '🔔'}
                                </button>
                                <div class="admin-orders-dropdown-popover" id="adminOrdersDropdownPopover">
                                </div>
                            </div>
                            <button type="button" class="btn-admin-header-panel" onclick="openAdminPanel()" title="Abrir Painel Administrativo">
                                Painel
                            </button>
                            <button type="button" class="btn-admin-header-logout" onclick="logoutAdmin()" title="Sair da Empresa">
                                Sair
                            </button>
                        </div>
                    `;
                } else {
                    // Quando não logado, o botão "Entrar" fica unificado no customerHeaderContainer
                    container.innerHTML = '';
                    container.style.display = 'none';
                }
            }

            updateMobileHeaderMenuUI();
        }

        // ========== CONTROLE DO DROPDOWN FLUTUANTE DE PEDIDOS ATIVOS ==========
        function toggleAdminOrdersDropdown(e) {
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            const popover = document.getElementById('adminOrdersDropdownPopover');
            if (!popover) return;
            const isOpen = popover.classList.contains('active');
            if (isOpen) {
                closeAdminOrdersDropdown();
            } else {
                renderAdminOrdersDropdown();
                popover.classList.add('active');
            }
        }

        function closeAdminOrdersDropdown() {
            const popover = document.getElementById('adminOrdersDropdownPopover');
            if (popover) {
                popover.classList.remove('active');
            }
        }

        function renderAdminOrdersDropdown() {
            const popover = document.getElementById('adminOrdersDropdownPopover');
            if (!popover) return;

            const allOrders = typeof getActiveCompanyOrders === 'function' ? getActiveCompanyOrders() : customerOrders;
            // Filtrar apenas pedidos NÃO entregues e NÃO cancelados (quando status for 'COMPLETED'/Entregue sai da lista)
            const activeOrders = allOrders.filter(o => o && o.status !== 'COMPLETED' && o.status !== 'CANCELLED');

            if (activeOrders.length === 0) {
                popover.innerHTML = `
                    <div class="admin-orders-dropdown-header">
                        <h4 class="admin-orders-dropdown-title">
                            <span>📦</span> Pedidos em Andamento
                        </h4>
                        <button type="button" class="admin-orders-dropdown-close-btn" onclick="closeAdminOrdersDropdown()" title="Fechar">✕</button>
                    </div>
                    <div class="admin-orders-dropdown-empty">
                        <div class="admin-orders-dropdown-empty-icon">✨</div>
                        <div class="admin-orders-dropdown-empty-title">Nenhum pedido pendente</div>
                        <div class="admin-orders-dropdown-empty-desc">Todos os pedidos recebidos já foram entregues ou finalizados.</div>
                    </div>
                    <div class="admin-orders-dropdown-footer">
                        <button type="button" class="admin-orders-dropdown-btn-all" onclick="goToAdminOrdersList()">
                            Ver Histórico no Painel ➔
                        </button>
                    </div>
                `;
                return;
            }

            const itemsHtml = activeOrders.map(order => {
                const st = (typeof adminOrderStatusMap !== 'undefined' && adminOrderStatusMap[order.status]) || { text: 'Recebido', icon: '🟡', bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' };
                const items = DefensiveUtils.safeArray(order.items);
                const itemsSummary = items.map(i => `${i.quantity || 1}x ${i.name || 'Item'}`).join(', ') || 'Sem itens descritos';
                const totalFormatted = DefensiveUtils.formatCurrency(order.total || 0);
                const customerName = escapeHtml(order.customerName || 'Cliente');
                const orderTime = order.time || (order.created_at ? new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Hoje');

                return `
                    <div class="admin-orders-dropdown-item" onclick="goToAdminOrder('${order.id}')" title="Clique para abrir e gerenciar este pedido no Painel">
                        <div class="admin-orders-dropdown-item-top">
                            <span class="admin-orders-dropdown-item-id">#${escapeHtml(String(order.id || ''))}</span>
                            <span class="admin-orders-dropdown-item-time">🕒 ${escapeHtml(String(orderTime))}</span>
                        </div>
                        <div class="admin-orders-dropdown-item-customer">
                            👤 ${customerName}
                        </div>
                        <div class="admin-orders-dropdown-item-summary">
                            ${escapeHtml(itemsSummary)}
                        </div>
                        <div class="admin-orders-dropdown-item-bottom">
                            <span class="admin-orders-dropdown-item-total">${totalFormatted}</span>
                            <span class="admin-orders-dropdown-item-status" style="background: ${st.bg}; color: ${st.color}; border: 1px solid ${st.border};">
                                ${st.icon} ${st.text}
                            </span>
                        </div>
                    </div>
                `;
            }).join('');

            popover.innerHTML = `
                <div class="admin-orders-dropdown-header">
                    <h4 class="admin-orders-dropdown-title">
                        <span>📦</span> Pedidos em Andamento
                        <span class="admin-orders-dropdown-count-badge">${activeOrders.length}</span>
                    </h4>
                    <button type="button" class="admin-orders-dropdown-close-btn" onclick="closeAdminOrdersDropdown()" title="Fechar">✕</button>
                </div>
                <div class="admin-orders-dropdown-list">
                    ${itemsHtml}
                </div>
                <div class="admin-orders-dropdown-footer">
                    <button type="button" class="admin-orders-dropdown-btn-all" onclick="goToAdminOrdersList()">
                        Ver Todos no Painel ➔
                    </button>
                </div>
            `;
        }

        function goToAdminOrdersList() {
            closeAdminOrdersDropdown();
            openAdminPanel();
            setTimeout(() => {
                const ordersSection = document.getElementById('adminOrdersSection');
                if (ordersSection) {
                    ordersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                filterAdminOrdersByStatus('ALL');
            }, 100);
        }

        function goToAdminOrder(orderId) {
            closeAdminOrdersDropdown();
            openAdminPanel();

            // Garantir que a lista mostre o pedido (filtro ALL)
            adminOrderFilterStatus = 'ALL';
            const chips = ['ALL', 'RECEIVED', 'PREPARING', 'DELIVERING', 'COMPLETED', 'CANCELLED'];
            chips.forEach(s => {
                const chipEl = document.getElementById(`chipStatus${s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}`);
                if (chipEl) {
                    if (s === 'ALL') chipEl.classList.add('active');
                    else chipEl.classList.remove('active');
                }
            });

            // Expandir o pedido específico
            expandedAdminOrders.add(orderId);
            renderAdminOrdersList();

            setTimeout(() => {
                const ordersSection = document.getElementById('adminOrdersSection');
                if (ordersSection) {
                    ordersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                setTimeout(() => {
                    const card = document.getElementById(`adminOrderCard_${orderId}`);
                    if (card) {
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        card.classList.add('admin-order-highlight-pulse');
                        setTimeout(() => {
                            card.classList.remove('admin-order-highlight-pulse');
                        }, 3000);
                    }
                }, 180);
            }, 120);
        }

        // ========== MANIPULAÇÃO DE IMAGENS E UPLOADS ==========
        function handleLogoUpload(input) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const logoVal = e.target.result;
                    const logoInput = document.getElementById('logoUrl');
                    if (logoInput) logoInput.value = logoVal;
                    settings.logoUrl = logoVal;
                    const activeComp = (typeof getActiveCompany === 'function' ? getActiveCompany() : null) || (typeof companies !== 'undefined' && companies.find(c => c.id === activeCompanyId));
                    if (activeComp) {
                        activeComp.logoUrl = logoVal;
                        activeComp.isCustomized = true;
                    }
                    updateAdminShareLinkDisplay();
                    showNotification('Foto da logo carregada com sucesso! 🖼️✨', 'success');
                };
                reader.readAsDataURL(input.files[0]);
            }
        }

        function handleProductImageUpload(input) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const dataUrl = e.target.result;
                    document.getElementById('productImage').value = dataUrl;
                    const preview = document.getElementById('productImagePreview');
                    if (preview) preview.src = dataUrl;
                    showNotification('Foto do produto carregada!', 'success');
                };
                reader.readAsDataURL(input.files[0]);
            }
        }

        function selectPresetImage(svgName) {
            document.getElementById('productImage').value = svgName;
            const preview = document.getElementById('productImagePreview');
            if (preview) preview.src = svgName;
        }

        function renderProductAdminList() {
            if (products.length === 0) {
                productAdminList.innerHTML = '<p style="text-align: center; color: var(--gray-600); padding: 1rem;">Nenhum produto cadastrado no cardápio.</p>';
                return;
            }
            
            productAdminList.innerHTML = products.map(product => `
                <div class="product-admin-item ${!product.available ? 'product-unavailable' : ''}">
                    <div style="display: flex; gap: 0.75rem; align-items: center;">
                        <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: contain; border-radius: 8px; background: #1e0526; padding: 2px;" onerror="this.onerror=null; this.src='acai_300ml.svg';">
                        <div class="product-admin-info">
                            <h4>${product.name} ${product.tag ? `<span style="font-size:0.7rem; color:#D97706; background:#FEF3C7; padding:1px 5px; border-radius:4px; font-weight:700;">${product.tag}</span>` : ''}</h4>
                            <p>${product.description.substring(0, 45)}...</p>
                            <div class="product-admin-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
                        </div>
                    </div>
                    <div class="product-admin-actions">
                        <button class="btn-icon btn-toggle" onclick="toggleProductAvailability(${product.id})" title="${product.available ? 'Desabilitar' : 'Habilitar'}">
                            ${product.available ? '👁️' : '🚫'}
                        </button>
                        <button class="btn-icon btn-edit" onclick="editProduct(${product.id})" title="Editar">
                            ✏️
                        </button>
                        <button class="btn-icon btn-delete" onclick="deleteProduct(${product.id})" title="Excluir">
                            🗑️
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function toggleProductCustomizationFields(enabled) {
            const container = document.getElementById('productCustomizationOptionsContainer');
            if (container) {
                container.style.display = enabled ? 'block' : 'none';
            }
        }

        function toggleProductFreeLimitInput(enabled) {
            const container = document.getElementById('productFreeLimitContainer');
            if (container) {
                container.style.display = enabled ? 'block' : 'none';
            }
        }

        // ========== GERENCIAR PRODUTOS ==========
        function addProduct() {
            editingProductId = null;
            document.getElementById('modalTitle').textContent = 'Adicionar Novo Produto';
            productForm.reset();
            document.getElementById('productAvailable').checked = true;
            
            if (document.getElementById('productIsAcai')) {
                document.getElementById('productIsAcai').checked = true;
                toggleProductCustomizationFields(true);
            }
            if (document.getElementById('productAllowFreeAccompaniments')) {
                document.getElementById('productAllowFreeAccompaniments').checked = true;
                toggleProductFreeLimitInput(true);
            }
            if (document.getElementById('productFreeLimit')) {
                document.getElementById('productFreeLimit').value = '3';
            }

            document.getElementById('productImage').value = 'super_barca.svg';
            const preview = document.getElementById('productImagePreview');
            if (preview) preview.src = 'super_barca.svg';
            productModal.classList.add('active');
        }

        function editProduct(id) {
            const product = products.find(p => p.id === id);
            if (!product) return;
            
            editingProductId = id;
            document.getElementById('modalTitle').textContent = 'Editar Produto';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            if (document.getElementById('productTag')) document.getElementById('productTag').value = product.tag || '';
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productImage').value = product.image;
            document.getElementById('productAvailable').checked = product.available;
            
            const isCustomEnabled = product.isCustomizable !== undefined ? product.isCustomizable : (product.isAcai !== false);
            if (document.getElementById('productIsAcai')) {
                document.getElementById('productIsAcai').checked = isCustomEnabled;
                toggleProductCustomizationFields(isCustomEnabled);
            }

            const allowFree = product.allowFreeAccompaniments !== false;
            if (document.getElementById('productAllowFreeAccompaniments')) {
                document.getElementById('productAllowFreeAccompaniments').checked = allowFree;
                toggleProductFreeLimitInput(allowFree);
            }

            const freeLimitVal = product.freeAccompanimentsLimit !== undefined ? product.freeAccompanimentsLimit : (product.freeLimit !== undefined ? product.freeLimit : 3);
            if (document.getElementById('productFreeLimit')) {
                document.getElementById('productFreeLimit').value = freeLimitVal;
            }
            
            const preview = document.getElementById('productImagePreview');
            if (preview) preview.src = product.image;

            productModal.classList.add('active');
        }

        function saveProduct(e) {
            e.preventDefault();
            
            const isCustom = document.getElementById('productIsAcai') ? document.getElementById('productIsAcai').checked : false;
            const allowFree = document.getElementById('productAllowFreeAccompaniments') ? document.getElementById('productAllowFreeAccompaniments').checked : true;
            const parsedLimit = parseInt(document.getElementById('productFreeLimit')?.value || '3', 10);
            const freeLimit = isNaN(parsedLimit) ? 3 : Math.max(0, parsedLimit);

            const productData = {
                id: editingProductId || Date.now(),
                name: document.getElementById('productName').value,
                tag: document.getElementById('productTag') ? document.getElementById('productTag').value : '',
                description: document.getElementById('productDescription').value,
                price: parseFloat(document.getElementById('productPrice').value),
                image: document.getElementById('productImage').value,
                available: document.getElementById('productAvailable').checked,
                isAcai: isCustom,
                isCustomizable: isCustom,
                allowFreeAccompaniments: allowFree,
                freeAccompanimentsLimit: freeLimit,
                freeLimit: freeLimit
            };
            
            if (editingProductId) {
                const index = products.findIndex(p => p.id === editingProductId);
                products[index] = productData;
            } else {
                products.push(productData);
            }
            
            saveData();
            renderAll();
            renderPresetCatalog(document.getElementById('presetSearchInput')?.value || '');
            productModal.classList.remove('active');
            
            showNotification('Produto salvo com sucesso!', 'success');
        }

        async function deleteProduct(id) {
            const confirmed = await showCustomConfirm({
                title: 'Excluir Produto',
                message: 'Deseja realmente excluir este produto do cardápio?',
                icon: '🗑️',
                confirmText: 'Sim, Excluir',
                cancelText: 'Cancelar'
            });
            if (!confirmed) return;
            
            products = products.filter(p => p.id !== id);
            saveData();
            renderAll();
            renderPresetCatalog(document.getElementById('presetSearchInput')?.value || '');
            
            showNotification('Produto excluído com sucesso!', 'success');
        }

        function toggleProductAvailability(id) {
            const product = products.find(p => p.id === id);
            if (!product) return;
            
            product.available = !product.available;
            saveData();
            renderAll();
            
            showNotification(`Produto ${product.available ? 'habilitado' : 'desabilitado'}!`, 'success');
        }

        // ========== SALVAR CONFIGURAÇÕES ==========
        function saveSettings() {
            settings.restaurantName = document.getElementById('restaurantName').value;
            
            const slugInput = document.getElementById('restaurantSlug');
            const customSlug = slugInput ? sanitizeSlug(slugInput.value) : '';
            settings.slug = customSlug || generateSlug(settings.restaurantName);

            if (document.getElementById('companyEmail')) {
                settings.email = document.getElementById('companyEmail').value.trim();
            }
            settings.logoUrl = document.getElementById('logoUrl').value;
            settings.subtitle = document.getElementById('restaurantSubtitle').value;
            if (document.getElementById('restaurantInstagram')) {
                settings.instagram = document.getElementById('restaurantInstagram').value.trim();
            }
            if (document.getElementById('restaurantCnpj')) {
                settings.cnpj = document.getElementById('restaurantCnpj').value.trim();
            }
            if (document.getElementById('restaurantAddress')) {
                settings.address = document.getElementById('restaurantAddress').value.trim();
            }
            settings.whatsappNumber = document.getElementById('whatsappNumber').value;
            settings.adminPassword = document.getElementById('adminPassword').value || 'admin123';
            settings.deliveryFee = parseFloat(document.getElementById('deliveryFee').value) || 6.00;
            if (document.getElementById('deliveryTime')) {
                settings.deliveryTime = document.getElementById('deliveryTime').value.trim() || '30 - 45 min';
            }

            const catSelectEl = document.getElementById('companyCategorySelect');
            if (catSelectEl && catSelectEl.value) {
                const newCat = catSelectEl.value;
                if (newCat !== settings.presetType) {
                    settings.presetType = newCat;
                    const activeComp = (typeof companies !== 'undefined' && Array.isArray(companies) && companies.find(c => c.id === activeCompanyId)) || (typeof getActiveCompany === 'function' ? getActiveCompany() : null);
                    if (activeComp) {
                        activeComp.presetType = newCat;
                    }
                }
            }
            
            // Salvar horários
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            settings.schedule = {};
            days.forEach(day => {
                settings.schedule[day] = {
                    enabled: document.getElementById(`schedule-${day}-enabled`).checked,
                    open: document.getElementById(`schedule-${day}-open`).value,
                    close: document.getElementById(`schedule-${day}-close`).value
                };
            });

            // Salvar Banner Promocional Customizado
            const promoEnabled = document.getElementById('promoBannerEnabled')?.checked;
            const promoBadge = document.getElementById('promoBannerBadge')?.value;
            const promoTitle = document.getElementById('promoBannerTitle')?.value;
            const promoSubtitle = document.getElementById('promoBannerSubtitle')?.value;
            const promoFooter = document.getElementById('promoBannerFooter')?.value;

            const c1Icon = document.getElementById('promoCard1Icon')?.value;
            const c1Title = document.getElementById('promoCard1Title')?.value;
            const c1Desc = document.getElementById('promoCard1Desc')?.value;

            const c2Icon = document.getElementById('promoCard2Icon')?.value;
            const c2Title = document.getElementById('promoCard2Title')?.value;
            const c2Desc = document.getElementById('promoCard2Desc')?.value;

            const c3Icon = document.getElementById('promoCard3Icon')?.value;
            const c3Title = document.getElementById('promoCard3Title')?.value;
            const c3Desc = document.getElementById('promoCard3Desc')?.value;

            settings.customBanner = {
                enabled: promoEnabled !== false,
                badge: promoBadge || '',
                title: promoTitle || '',
                subtitle: promoSubtitle || '',
                footerNote: promoFooter || '',
                cards: [
                    { icon: c1Icon || '🥗', title: c1Title || '', desc: c1Desc || '' },
                    { icon: c2Icon || '🍳', title: c2Title || '', desc: c2Desc || '' },
                    { icon: c3Icon || '🥤', title: c3Title || '', desc: c3Desc || '' }
                ]
            };

            // Salvar Seção de Acompanhamentos Customizada (Suporta múltiplos blocos/títulos de categorias e limite de grátis)
            const extrasEnabled = document.getElementById('extrasSectionEnabled')?.checked;
            const extrasBadge = document.getElementById('extrasSectionBadge')?.value;
            const extrasTitle = document.getElementById('extrasSectionTitle')?.value;
            const extrasDesc = document.getElementById('extrasSectionDesc')?.value;
            const extrasFreeLimitInput = document.getElementById('extrasFreeLimit')?.value;
            const parsedFreeLimit = parseInt(extrasFreeLimitInput || '3', 10);
            const extrasFreeLimit = isNaN(parsedFreeLimit) ? 3 : Math.max(0, parsedFreeLimit);

            // Garantir que categorias salvas sejam válidas e limpas
            const cleanCategories = (currentAdminExtrasCategories || []).map(cat => ({
                name: (cat.name || '').trim() || 'Acompanhamentos',
                chips: Array.isArray(cat.chips) ? cat.chips.filter(chip => (chip.name || '').trim() !== '') : []
            }));

            settings.customExtras = {
                enabled: extrasEnabled !== false,
                badge: extrasBadge || '',
                title: extrasTitle || '',
                desc: extrasDesc || '',
                freeLimit: extrasFreeLimit,
                categories: cleanCategories
            };
            settings.freeAccompanimentsLimit = extrasFreeLimit;

            saveData();
            syncCompaniesToServer();
            updateSiteSettings();
            renderDynamicPromoBanner();
            renderDynamicIngredientsSection();
            updateAdminShareLinkDisplay();
            
            showNotification('Configurações salvas com sucesso!', 'success');
        }

        // Editor e Manipuladores da Seção de Acompanhamentos no Painel (Múltiplas Categorias)
        function renderAdminExtrasCategoriesEditor() {
            const container = document.getElementById('adminExtrasCategoriesContainer');
            if (!container) return;

            if (!currentAdminExtrasCategories || currentAdminExtrasCategories.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; color: var(--gray-600); font-size: 0.82rem; padding: 1rem; background: var(--gray-50); border: 1px dashed var(--gray-300); border-radius: 8px;">
                        Nenhuma categoria/bloco cadastrado. Clique no botão abaixo para adicionar sua primeira categoria!
                    </div>
                `;
                return;
            }

            container.innerHTML = currentAdminExtrasCategories.map((cat, catIdx) => `
                <div class="extras-category-block" style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 10px; padding: 0.85rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <!-- Cabeçalho do Bloco da Categoria -->
                    <div style="display: flex; gap: 0.5rem; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; flex-wrap: wrap; background: #F8FAFC; padding: 0.5rem 0.75rem; border-radius: 8px; border: 1px solid #E2E8F0;">
                        <div style="display: flex; align-items: center; gap: 0.4rem; flex: 1; min-width: 240px;">
                            <span style="font-size: 0.82rem; font-weight: bold; color: #4F46E5;">Bloco ${catIdx + 1}:</span>
                            <input type="text" class="form-input" id="extrasCatTitleInput_${catIdx}" value="${cat.name || ''}" placeholder="Ex: 🍳 Acompanhamentos Salgados" oninput="updateAdminExtrasCategoryTitle(${catIdx}, this.value)" style="font-weight: bold; font-size: 0.9rem; padding: 0.35rem 0.5rem; flex: 1;">
                            <button type="button" onclick="appendIconToInput('extrasCatTitleInput_${catIdx}')" title="Inserir Ícone no Título" style="background: #E2E8F0; border: 1px solid #CBD5E1; border-radius: 6px; padding: 0.35rem 0.5rem; cursor: pointer; font-size: 0.85rem;">🎨</button>
                        </div>
                        <div style="display: flex; gap: 0.35rem; align-items: center;">
                            <button type="button" class="btn-admin" onclick="addAdminExtrasChipToCategory(${catIdx})" style="background: #10B981; color: white; font-size: 0.75rem; padding: 0.3rem 0.6rem; border-radius: 6px; font-weight: bold;">
                                ➕ Add Item
                            </button>
                            <button type="button" onclick="removeAdminExtrasCategoryBlock(${catIdx})" title="Excluir este bloco de categoria" style="background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; border-radius: 6px; padding: 0.3rem 0.55rem; font-size: 0.82rem; cursor: pointer;">
                                🗑️ Excluir Bloco
                            </button>
                        </div>
                    </div>

                    <!-- Lista de Itens/Chips desta Categoria -->
                    <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                        ${(!cat.chips || cat.chips.length === 0) ? `
                            <div style="text-align: center; color: var(--gray-600); font-size: 0.76rem; padding: 0.5rem; background: #F8FAFC; border-radius: 6px;">
                                Nenhum item neste bloco. Clique em "➕ Add Item" acima para adicionar.
                            </div>
                        ` : cat.chips.map((chip, chipIdx) => {
                            const isChipFree = (chip.isFree === true) || (chip.price === '' || chip.price === '0' || chip.price === 'Grátis' || chip.price === 'gratis');
                            return `
                            <div style="display: grid; grid-template-columns: 80px 1fr 90px 95px 34px; gap: 0.35rem; align-items: center; background: #F8FAFC; padding: 0.35rem; border-radius: 6px; border: 1px solid #E2E8F0;">
                                <div style="display: flex; gap: 0.15rem;">
                                    <input type="text" class="form-input" value="${chip.icon || '✨'}" readonly onclick="openIconPickerForExtrasCategoryChip(${catIdx}, ${chipIdx})" style="text-align: center; font-size: 1.05rem; padding: 0.25rem; cursor: pointer; width: 44px;" title="Clique para escolher ícone">
                                    <button type="button" onclick="openIconPickerForExtrasCategoryChip(${catIdx}, ${chipIdx})" title="Escolher Ícone" style="background: #E2E8F0; border: 1px solid #CBD5E1; border-radius: 6px; padding: 0 0.25rem; cursor: pointer; font-size: 0.8rem;">🎨</button>
                                </div>
                                <input type="text" class="form-input" value="${chip.name || ''}" placeholder="Nome do acompanhamento / item" oninput="updateAdminExtrasCategoryChipField(${catIdx}, ${chipIdx}, 'name', this.value)" style="font-size: 0.82rem; padding: 0.3rem;">
                                <button type="button" onclick="toggleAdminExtrasCategoryChipFree(${catIdx}, ${chipIdx})" title="Clique para alternar entre Grátis e Pago" style="font-size: 0.74rem; font-weight: 700; padding: 0.3rem 0.35rem; border-radius: 6px; cursor: pointer; border: 1px solid ${isChipFree ? '#6EE7B7' : '#FCD34D'}; background: ${isChipFree ? '#ECFDF5' : '#FFFBEB'}; color: ${isChipFree ? '#047857' : '#B45309'}; text-align: center; white-space: nowrap;">
                                    ${isChipFree ? '🎁 Grátis' : '💰 Pago'}
                                </button>
                                <input type="text" class="form-input" value="${chip.price || (isChipFree ? 'Grátis' : '+R$ 2,50')}" placeholder="Grátis ou +R$ 2,50" oninput="updateAdminExtrasCategoryChipField(${catIdx}, ${chipIdx}, 'price', this.value)" style="font-size: 0.82rem; padding: 0.3rem;">
                                <button type="button" onclick="removeAdminExtrasChipFromCategory(${catIdx}, ${chipIdx})" title="Remover este item" style="background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; border-radius: 6px; padding: 0.25rem; font-size: 0.82rem; cursor: pointer; text-align: center;">
                                    🗑️
                                </button>
                            </div>
                        `;}).join('')}
                    </div>
                </div>
            `).join('');
        }

        // ========== GERENCIAMENTO DE CUPONS DE DESCONTO NO ADMIN ==========
        function renderAdminCouponsList() {
            const container = document.getElementById('adminCouponsList');
            if (!container) return;

            const coupons = DefensiveUtils.safeArray(settings.coupons);

            if (coupons.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; color: var(--gray-600); font-size: 0.82rem; padding: 0.75rem; background: var(--gray-50); border: 1px dashed var(--gray-300); border-radius: 8px;">
                        Nenhum cupom cadastrado. Use o formulário acima para criar cupons com % de desconto!
                    </div>
                `;
                return;
            }

            container.innerHTML = coupons.map(c => {
                if (!c) return '';
                const code = DefensiveUtils.escapeHtml(c.code || '');
                const discount = DefensiveUtils.safeNumber(c.discount, 0);
                const desc = c.description ? `<div style="width: 100%; font-size: 0.76rem; color: var(--gray-600); margin-top: -2px;">${DefensiveUtils.escapeHtml(c.description)}</div>` : '';
                const isActive = c.active !== false;

                return `
                <div class="coupon-admin-card ${!isActive ? 'inactive' : ''}">
                    <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                        <span style="font-weight: 800; font-size: 0.88rem; color: var(--primary-dark); letter-spacing: 0.5px;">
                            🏷️ ${code}
                        </span>
                        <span style="background: ${isActive ? '#10B981' : '#94A3B8'}; color: white; font-size: 0.72rem; font-weight: 800; padding: 2px 7px; border-radius: 20px;">
                            ${discount}% OFF
                        </span>
                        <span style="font-size: 0.75rem; color: ${isActive ? '#059669' : '#64748B'}; font-weight: 600;">
                            ${isActive ? '🟢 Ativo' : '⚪ Inativo'}
                        </span>
                    </div>
                    ${desc}
                    <div style="display: flex; gap: 0.35rem; align-items: center; margin-left: auto;">
                        <button type="button" class="btn-admin" onclick="toggleCouponActive('${code}')" style="padding: 0.25rem 0.55rem; font-size: 0.75rem; background: ${isActive ? '#F59E0B' : '#10B981'}; color: white;">
                            ${isActive ? '⏸️ Pausar' : '▶️ Ativar'}
                        </button>
                        <button type="button" onclick="deleteCoupon('${code}')" title="Excluir Cupom" style="background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; border-radius: 6px; padding: 0.25rem 0.5rem; font-size: 0.8rem; cursor: pointer;">
                            🗑️
                        </button>
                    </div>
                </div>
            `;
            }).join('');
        }

        function handleAdminCreateCoupon(e) {
            if (e) e.preventDefault();
            const codeInput = document.getElementById('newCouponCode');
            const discountInput = document.getElementById('newCouponDiscount');
            const descInput = document.getElementById('newCouponDesc');
            const activeInput = document.getElementById('newCouponActive');

            if (!codeInput || !discountInput) return;

            const code = codeInput.value.trim().toUpperCase();
            const discount = parseFloat(discountInput.value);
            const description = descInput ? descInput.value.trim() : '';
            const active = activeInput ? activeInput.checked : true;

            if (!code) {
                showNotification('Informe o código do cupom!', 'warning');
                return;
            }

            if (isNaN(discount) || discount <= 0 || discount > 100) {
                showNotification('Informe um percentual de desconto válido entre 1% e 100%!', 'warning');
                return;
            }

            if (!settings.coupons) settings.coupons = [];

            const existingIndex = settings.coupons.findIndex(c => c.code.toUpperCase() === code);
            if (existingIndex >= 0) {
                if (confirm(`O cupom "${code}" já existe. Deseja atualizar o desconto para ${discount}%?`)) {
                    settings.coupons[existingIndex].discount = discount;
                    settings.coupons[existingIndex].description = description;
                    settings.coupons[existingIndex].active = active;
                } else {
                    return;
                }
            } else {
                settings.coupons.unshift({
                    code: code,
                    discount: discount,
                    description: description,
                    active: active
                });
            }

            saveData();
            renderAdminCouponsList();
            updateCartUI();

            // Limpar formulário
            codeInput.value = '';
            discountInput.value = '';
            if (descInput) descInput.value = '';
            if (activeInput) activeInput.checked = true;

            showNotification(`Cupom ${code} (${discount}% OFF) salvo com sucesso! 🎉`, 'success');
        }

        function toggleCouponActive(couponCode) {
            if (!settings.coupons) return;
            const coupon = settings.coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
            if (!coupon) return;

            coupon.active = !(coupon.active !== false);
            if (!coupon.active && appliedCoupon && appliedCoupon.code.toUpperCase() === couponCode.toUpperCase()) {
                appliedCoupon = null;
            }

            saveData();
            renderAdminCouponsList();
            updateCartUI();
            showNotification(`Cupom ${coupon.code} ${coupon.active ? 'ativado' : 'pausado'}!`, 'info');
        }

        async function deleteCoupon(couponCode) {
            const confirmed = await showCustomConfirm({
                title: 'Excluir Cupom',
                message: `Tem certeza que deseja excluir o cupom "${couponCode}"?`,
                icon: '🏷️',
                confirmText: 'Sim, Excluir',
                cancelText: 'Cancelar'
            });
            if (!confirmed) return;

            if (!settings.coupons) return;
            settings.coupons = settings.coupons.filter(c => c.code.toUpperCase() !== couponCode.toUpperCase());

            if (appliedCoupon && appliedCoupon.code.toUpperCase() === couponCode.toUpperCase()) {
                appliedCoupon = null;
            }

            saveData();
            renderAdminCouponsList();
            updateCartUI();
            showNotification(`Cupom "${couponCode}" excluído com sucesso!`, 'info');
        }

        // ========== GERENCIAMENTO DE BAIRROS E FRETE POR REGIÃO (ZONA SUL, ZONA NORTE, CENTRO) ==========
        let currentNeighborhoodFilterZone = 'all';
        let currentNeighborhoodSearchTerm = '';

        function getZoneBadgeHTML(zone, zoneName) {
            let label = zoneName;
            let badgeClass = 'zone-badge-outra';
            let icon = '➕';

            if (zone === 'centro') {
                label = 'Centro';
                badgeClass = 'zone-badge-centro';
                icon = '🏙️';
            } else if (zone === 'zona_sul') {
                label = 'Zona Sul';
                badgeClass = 'zone-badge-zona_sul';
                icon = '🌊';
            } else if (zone === 'zona_norte') {
                label = 'Zona Norte';
                badgeClass = 'zone-badge-zona_norte';
                icon = '🌳';
            }

            return `<span class="neighborhood-zone-badge ${badgeClass}">${icon} ${label}</span>`;
        }

        function setNeighborhoodFilterZone(zone) {
            currentNeighborhoodFilterZone = zone;
            const tabsContainer = document.getElementById('zoneFilterTabs');
            if (tabsContainer) {
                const buttons = tabsContainer.querySelectorAll('.zone-tab-btn');
                buttons.forEach(btn => btn.classList.remove('active'));
                const activeBtn = tabsContainer.querySelector(`button[onclick*="'${zone}'"]`);
                if (activeBtn) activeBtn.classList.add('active');
            }
            renderAdminNeighborhoodsList();
        }

        function handleSearchNeighborhood(term) {
            currentNeighborhoodSearchTerm = (term || '').trim().toLowerCase();
            renderAdminNeighborhoodsList();
        }

        function renderAdminNeighborhoodsList() {
            const container = document.getElementById('adminNeighborhoodsList');
            if (!container) return;

            const rawList = settings.deliveryNeighborhoods || DEFAULT_DELIVERY_NEIGHBORHOODS;
            const list = DefensiveUtils.safeArray(rawList);

            // Atualizar contadores
            const countAll = list.length;
            const countCentro = list.filter(n => n && n.zone === 'centro').length;
            const countZonaSul = list.filter(n => n && n.zone === 'zona_sul').length;
            const countZonaNorte = list.filter(n => n && n.zone === 'zona_norte').length;
            const countOutros = list.filter(n => n && n.zone !== 'centro' && n.zone !== 'zona_sul' && n.zone !== 'zona_norte').length;

            const elAll = document.getElementById('countAllNeighborhoods');
            const elCentro = document.getElementById('countCentroNeighborhoods');
            const elZonaSul = document.getElementById('countZonaSulNeighborhoods');
            const elZonaNorte = document.getElementById('countZonaNorteNeighborhoods');
            const elOutros = document.getElementById('countOutrosNeighborhoods');

            if (elAll) elAll.textContent = countAll;
            if (elCentro) elCentro.textContent = countCentro;
            if (elZonaSul) elZonaSul.textContent = countZonaSul;
            if (elZonaNorte) elZonaNorte.textContent = countZonaNorte;
            if (elOutros) elOutros.textContent = countOutros;

            // Filtragem
            let filtered = list.filter(n => !!n);
            if (currentNeighborhoodFilterZone !== 'all') {
                if (currentNeighborhoodFilterZone === 'outra') {
                    filtered = filtered.filter(n => n.zone !== 'centro' && n.zone !== 'zona_sul' && n.zone !== 'zona_norte');
                } else {
                    filtered = filtered.filter(n => n.zone === currentNeighborhoodFilterZone);
                }
            }

            if (currentNeighborhoodSearchTerm) {
                filtered = filtered.filter(n => 
                    (n.name && n.name.toLowerCase().includes(currentNeighborhoodSearchTerm)) ||
                    (n.zoneName && n.zoneName.toLowerCase().includes(currentNeighborhoodSearchTerm))
                );
            }

            if (filtered.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; color: var(--gray-600); font-size: 0.85rem; padding: 1.5rem; background: var(--gray-50); border: 1px dashed var(--gray-300); border-radius: 8px;">
                        Nenhum bairro encontrado com os filtros selecionados.
                    </div>
                `;
                return;
            }

            container.innerHTML = filtered.map(n => {
                const isActive = n.active !== false;
                const feeVal = DefensiveUtils.safeNumber(n.fee, 0).toFixed(2);
                const timeVal = DefensiveUtils.escapeHtml(n.time || '30 - 45 min');
                const name = DefensiveUtils.escapeHtml(n.name || 'Bairro');
                const id = DefensiveUtils.escapeHtml(n.id || '');

                return `
                    <div class="neighborhood-item-card ${!isActive ? 'inactive' : ''}" id="card-neighborhood-${id}">
                        <div class="neighborhood-info">
                            <div class="neighborhood-name-text">
                                <span>${name}</span>
                                ${getZoneBadgeHTML(n.zone, n.zoneName)}
                            </div>
                        </div>

                        <div class="neighborhood-inputs-grid">
                            <div class="neighborhood-input-wrapper" title="Valor do Frete para este bairro">
                                <label>R$</label>
                                <input 
                                    type="number" 
                                    step="0.50" 
                                    min="0" 
                                    value="${feeVal}" 
                                    onchange="updateNeighborhoodField('${id}', 'fee', this.value)"
                                    style="width: 65px;"
                                >
                            </div>

                            <div class="neighborhood-input-wrapper neighborhood-input-time" title="Tempo estimado de entrega para este bairro">
                                <label>⏱️</label>
                                <input 
                                    type="text" 
                                    value="${timeVal}" 
                                    placeholder="30 - 45 min" 
                                    onchange="updateNeighborhoodField('${id}', 'time', this.value)"
                                    style="width: 90px;"
                                >
                            </div>

                            <button 
                                type="button" 
                                class="btn-icon btn-toggle" 
                                onclick="toggleNeighborhoodActive('${id}')" 
                                title="${isActive ? 'Bairro ativo para entregas (clique para pausar)' : 'Bairro pausado (clique para ativar)'}"
                                style="width: 32px; height: 32px; font-size: 0.9rem;"
                            >
                                ${isActive ? '✅' : '🚫'}
                            </button>

                            <button 
                                type="button" 
                                class="btn-icon btn-delete" 
                                onclick="deleteNeighborhood('${id}')" 
                                title="Excluir bairro"
                                style="width: 32px; height: 32px; font-size: 0.85rem;"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function updateNeighborhoodField(id, field, value) {
            if (!settings.deliveryNeighborhoods) settings.deliveryNeighborhoods = [...DEFAULT_DELIVERY_NEIGHBORHOODS];
            const item = settings.deliveryNeighborhoods.find(n => n.id === id);
            if (!item) return;

            if (field === 'fee') {
                item.fee = parseFloat(value) || 0;
            } else if (field === 'time') {
                item.time = value.trim() || '30 - 45 min';
            }
            saveData();
            updateCartUI();
        }

        function toggleNeighborhoodActive(id) {
            if (!settings.deliveryNeighborhoods) settings.deliveryNeighborhoods = [...DEFAULT_DELIVERY_NEIGHBORHOODS];
            const item = settings.deliveryNeighborhoods.find(n => n.id === id);
            if (!item) return;

            item.active = !(item.active !== false);
            saveData();
            renderAdminNeighborhoodsList();
            updateCartUI();
            showNotification(`Bairro ${item.name} ${item.active ? 'ativado' : 'pausado'}!`, 'info');
        }

        async function deleteNeighborhood(id) {
            if (!settings.deliveryNeighborhoods) return;
            const item = settings.deliveryNeighborhoods.find(n => n.id === id);
            if (!item) return;

            const confirmed = await showCustomConfirm({
                title: 'Excluir Bairro',
                message: `Deseja realmente remover o bairro "${item.name}" das opções de entrega?`,
                icon: '🛵',
                confirmText: 'Sim, Excluir',
                cancelText: 'Cancelar'
            });
            if (!confirmed) return;

            settings.deliveryNeighborhoods = settings.deliveryNeighborhoods.filter(n => n.id !== id);
            saveData();
            renderAdminNeighborhoodsList();
            updateCartUI();
            showNotification(`Bairro "${item.name}" excluído!`, 'info');
        }

        function handleAdminAddNeighborhood(event) {
            event.preventDefault();
            const nameInput = document.getElementById('newNeighborhoodName');
            const zoneInput = document.getElementById('newNeighborhoodZone');
            const feeInput = document.getElementById('newNeighborhoodFee');
            const timeInput = document.getElementById('newNeighborhoodTime');

            if (!nameInput || !feeInput) return;

            const name = nameInput.value.trim();
            const zone = zoneInput ? zoneInput.value : 'centro';
            const fee = parseFloat(feeInput.value) || 0;
            const time = timeInput && timeInput.value.trim() ? timeInput.value.trim() : '30 - 45 min';

            if (!name) {
                showNotification('Informe o nome do bairro!', 'warning');
                return;
            }

            if (!settings.deliveryNeighborhoods) settings.deliveryNeighborhoods = [...DEFAULT_DELIVERY_NEIGHBORHOODS];

            const zoneNameMap = {
                'centro': 'Centro',
                'zona_sul': 'Zona Sul',
                'zona_norte': 'Zona Norte',
                'outra': 'Outra Região'
            };

            const newId = 'b-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
            settings.deliveryNeighborhoods.unshift({
                id: newId,
                name: name,
                zone: zone,
                zoneName: zoneNameMap[zone] || 'Outra Região',
                fee: fee,
                time: time,
                active: true
            });

            saveData();
            renderAdminNeighborhoodsList();
            updateCartUI();

            nameInput.value = '';
            feeInput.value = '';
            if (timeInput) timeInput.value = '';

            showNotification(`Bairro "${name}" adicionado com sucesso! 🛵✨`, 'success');
        }

        function applyBulkZoneSettings() {
            const zone = document.getElementById('bulkZoneSelect')?.value || 'all';
            const feeVal = document.getElementById('bulkZoneFee')?.value;
            const timeVal = document.getElementById('bulkZoneTime')?.value?.trim();

            if (!feeVal && !timeVal) {
                showNotification('Informe o valor do frete ou o tempo estimado para aplicar!', 'warning');
                return;
            }

            if (!settings.deliveryNeighborhoods) settings.deliveryNeighborhoods = [...DEFAULT_DELIVERY_NEIGHBORHOODS];

            let count = 0;
            settings.deliveryNeighborhoods.forEach(n => {
                const match = zone === 'all' || 
                              (zone === 'outra' && n.zone !== 'centro' && n.zone !== 'zona_sul' && n.zone !== 'zona_norte') ||
                              n.zone === zone;
                if (match) {
                    if (feeVal !== '' && !isNaN(parseFloat(feeVal))) {
                        n.fee = parseFloat(feeVal);
                    }
                    if (timeVal) {
                        n.time = timeVal;
                    }
                    count++;
                }
            });

            saveData();
            renderAdminNeighborhoodsList();
            updateCartUI();
            showNotification(`Configurações aplicadas a ${count} bairro(s)! ⚡`, 'success');
        }

        async function resetNeighborhoodsToDefault() {
            const confirmed = await showCustomConfirm({
                title: 'Restaurar Bairros Padrão',
                message: 'Deseja restaurar a lista original de bairros do Rio de Janeiro (Centro, Zona Sul e Zona Norte) com suas taxas padrão?',
                icon: '🔄',
                confirmText: 'Sim, Restaurar',
                cancelText: 'Cancelar'
            });
            if (!confirmed) return;

            settings.deliveryNeighborhoods = JSON.parse(JSON.stringify(DEFAULT_DELIVERY_NEIGHBORHOODS));
            saveData();
            renderAdminNeighborhoodsList();
            updateCartUI();
            showNotification('Bairros padrão restaurados com sucesso!', 'success');
        }

        function saveNeighborhoodsChanges() {
            saveData();
            renderAdminNeighborhoodsList();
            updateCartUI();
            showNotification('Todas as alterações de bairros e fretes foram salvas com sucesso! 💾🎉', 'success');
        }

        // ========== CATEGORIAS E COLEÇÃO DE ÍCONES / EMOJIS COMPLETA ==========
        const ICON_CATEGORIES = [
            { id: 'all', name: 'Todas', icon: '🗂️' },
            { id: 'marmita', name: 'Refeições', icon: '🍱' },
            { id: 'lanches', name: 'Lanches & Burgers', icon: '🍔' },
            { id: 'pizzas', name: 'Pizzas & Massas', icon: '🍕' },
            { id: 'acai', name: 'Açaí & Sobremesas', icon: '🍧' },
            { id: 'frutas', name: 'Frutas Frescas', icon: '🍓' },
            { id: 'bebidas', name: 'Bebidas & Sucos', icon: '🥤' },
            { id: 'selos', name: 'Selos & Promoções', icon: '⚡' },
            { id: 'delivery', name: 'Delivery & Loja', icon: '🛵' }
        ];

        const ICON_COLLECTION = [
            // REFEIÇÕES E MARMITAS
            { icon: '🍱', title: 'Marmita / Bentô', category: 'marmita', keywords: 'marmita bento prato comida almoço quentinha executiva feijoada' },
            { icon: '🍲', title: 'Ensopado / Caldo', category: 'marmita', keywords: 'sopa ensopado feijoada caldeirão panela comida caldo' },
            { icon: '🍳', title: 'Ovo Frito', category: 'marmita', keywords: 'ovo frito frigideira café almoço gema acompanhamento' },
            { icon: '🥩', title: 'Carne / Bife', category: 'marmita', keywords: 'carne bife picanha churrasco grelhado alcatra contrafilé' },
            { icon: '🍗', title: 'Frango Assado / Coxa', category: 'marmita', keywords: 'frango coxa assado grelhado passarinho filé de frango' },
            { icon: '🍖', title: 'Costela / Churrasco', category: 'marmita', keywords: 'costela carne osso churrasco suíno porco' },
            { icon: '🍛', title: 'Prato Feito / PF', category: 'marmita', keywords: 'curry arroz prato feito pf refeição completa feijão' },
            { icon: '🍚', title: 'Arroz Branco', category: 'marmita', keywords: 'arroz branco acompanhamento porção' },
            { icon: '🥗', title: 'Salada Fresca', category: 'marmita', keywords: 'salada fresca alface tomate maionese legumes vegetal' },
            { icon: '🥣', title: 'Tigela / Cumbuca', category: 'marmita', keywords: 'tigela açai sopa cumbuca cereal' },
            { icon: '🧆', title: 'Almôndega / Bolinho', category: 'marmita', keywords: 'falafel almôndega bolinho carne moída' },
            { icon: '🥔', title: 'Batata Purê / Cozida', category: 'marmita', keywords: 'batata purê assada cozida' },
            { icon: '🥕', title: 'Cenoura', category: 'marmita', keywords: 'cenoura legume vegetal cozido' },
            { icon: '🌽', title: 'Milho Verde', category: 'marmita', keywords: 'milho verde cuscuz espiga acompanhamento' },
            { icon: '🥦', title: 'Brócolis', category: 'marmita', keywords: 'brócolis vegetal verde saudável' },
            { icon: '🧀', title: 'Queijo', category: 'marmita', keywords: 'queijo coalho cheddar mussarela parmesão' },
            { icon: '🥓', title: 'Bacon Crocante', category: 'marmita', keywords: 'bacon crocante defumado frito' },
            { icon: '🧄', title: 'Alho Frito', category: 'marmita', keywords: 'alho tempero alho frito' },
            { icon: '🧅', title: 'Cebola Acebolada', category: 'marmita', keywords: 'cebola acebolado tempero roxa' },
            { icon: '🌶️', title: 'Pimenta / Molho Picante', category: 'marmita', keywords: 'pimenta picante molho ardido' },
            { icon: '🥢', title: 'Comida Oriental / Hashi', category: 'marmita', keywords: 'hashi palitinhos comida oriental sushi yakisoba' },
            { icon: '🍽️', title: 'Prato com Talheres', category: 'marmita', keywords: 'prato talheres garfo faca refeição almoço' },

            // LANCHES E BURGERS
            { icon: '🍔', title: 'Hambúrguer Artesanal', category: 'lanches', keywords: 'hamburguer burger burguer artesanal smash queijo carne' },
            { icon: '🍟', title: 'Batata Frita', category: 'lanches', keywords: 'batata frita porção acompanhamento snack crocante' },
            { icon: '🌭', title: 'Cachorro-Quente', category: 'lanches', keywords: 'cachorro quente hot dog salsicha lanche' },
            { icon: '🥪', title: 'Sanduíche / Misto Quente', category: 'lanches', keywords: 'misto quente sanduíche pão lanche queijo presunto' },
            { icon: '🌮', title: 'Taco Mexicano', category: 'lanches', keywords: 'taco mexicano carne crocante' },
            { icon: '🌯', title: 'Burrito / Wrap', category: 'lanches', keywords: 'burrito enrolado wrap lanche' },
            { icon: '🫔', title: 'Tamal / Pamonha', category: 'lanches', keywords: 'tamal pamonha milho salgado' },
            { icon: '🥨', title: 'Pretzel / Salgado', category: 'lanches', keywords: 'pretzel salgado massa lanche' },
            { icon: '🥯', title: 'Bagel / Pão Especial', category: 'lanches', keywords: 'bagel pão recheado' },

            // PIZZAS E MASSAS
            { icon: '🍕', title: 'Pizza Artesanal', category: 'pizzas', keywords: 'pizza fatia queijo calcinha brotinho borda recheada calabresa' },
            { icon: '🍝', title: 'Espaguete / Macarrão', category: 'pizzas', keywords: 'espaguete macarrão massa molho bolonhesa talharim' },
            { icon: '🍜', title: 'Lámen / Yakisoba', category: 'pizzas', keywords: 'miojo lamen macarrão sopa yakisoba oriental' },
            { icon: '🫓', title: 'Pão Sírio / Esfirra', category: 'pizzas', keywords: 'pão massa esfirra beirute' },
            { icon: '🥟', title: 'Pastel / Guioza', category: 'pizzas', keywords: 'pastel frito guioza salgado folhado' },

            // AÇAÍ, SOBREMESAS E DOCES
            { icon: '🍧', title: 'Açaí na Quentinha / Taça', category: 'acai', keywords: 'açaí quentinha raspadinha sorvete taça copo' },
            { icon: '🍨', title: 'Sorvete em Taça', category: 'acai', keywords: 'sorvete taça bola de sorvete sobremesa gelato' },
            { icon: '🍦', title: 'Casquinha / Sorvete Misto', category: 'acai', keywords: 'casquinha sorvete de casquinha mista cone' },
            { icon: '🍫', title: 'Chocolate / Nutella', category: 'acai', keywords: 'chocolate nutella barra cacau gotas cobertura' },
            { icon: '🍰', title: 'Bolo de Pote / Torta', category: 'acai', keywords: 'bolo fatia torta doce recheado pote' },
            { icon: '🧁', title: 'Cupcake / Bolinho', category: 'acai', keywords: 'cupcake bolinho doce confeito' },
            { icon: '🥧', title: 'Torta Doce', category: 'acai', keywords: 'torta doce salgada cheesecake' },
            { icon: '🍬', title: 'Balas / Confetes M&Ms', category: 'acai', keywords: 'bala doce confete jujuba mm disqueti guloseima' },
            { icon: '🍩', title: 'Donut / Rosquinha', category: 'acai', keywords: 'donut rosquinha doce cobertura' },
            { icon: '🍪', title: 'Cookie / Biscoito', category: 'acai', keywords: 'biscoito cookie gotinhas gotas chocolate' },
            { icon: '🚤', title: 'Super Barca de Açaí', category: 'acai', keywords: 'barca super barca açaí barco porção grande' },
            { icon: '🪣', title: 'Balde de Açaí', category: 'acai', keywords: 'balde balde de açaí porção grande gigante' },
            { icon: '🍯', title: 'Mel / Calda Dourada', category: 'acai', keywords: 'mel pote de mel doce calda' },
            { icon: '🧇', title: 'Waffle com Calda', category: 'acai', keywords: 'waffle doce cobertura sobremesa' },
            { icon: '🥞', title: 'Panqueca Doce / Salgada', category: 'acai', keywords: 'panqueca mel calda café' },
            { icon: '🍮', title: 'Pudim com Caramelo', category: 'acai', keywords: 'pudim caramelo leite condensado sobremesa' },

            // FRUTAS FRESCAS
            { icon: '🍓', title: 'Morango Fresco', category: 'frutas', keywords: 'morango fruta doce fresco fatiado' },
            { icon: '🍌', title: 'Banana Fatiada', category: 'frutas', keywords: 'banana fruta caramelizada fatiada' },
            { icon: '🍇', title: 'Uva Sem Semente', category: 'frutas', keywords: 'uva cacho fruta fresca roxa' },
            { icon: '🥭', title: 'Manga Tropical', category: 'frutas', keywords: 'manga fruta tropical pedaços suco' },
            { icon: '🍍', title: 'Abacaxi em Cubos', category: 'frutas', keywords: 'abacaxi fruta suco cubos' },
            { icon: '🍉', title: 'Melancia', category: 'frutas', keywords: 'melancia fatia suco refrescante' },
            { icon: '🥑', title: 'Abacate / Creme', category: 'frutas', keywords: 'abacate creme guacamole vitamina' },
            { icon: '🍒', title: 'Cereja em Calda', category: 'frutas', keywords: 'cereja calda sobremesa vermelha' },
            { icon: '🍊', title: 'Laranja / Tangerina', category: 'frutas', keywords: 'laranja suco vitamina c gomo' },
            { icon: '🍋', title: 'Limão / Limonada', category: 'frutas', keywords: 'limão suco limonada azedo' },
            { icon: '🍏', title: 'Maçã Verde', category: 'frutas', keywords: 'maçã verde fruta fatiada' },
            { icon: '🍐', title: 'Pêra Fresca', category: 'frutas', keywords: 'pera fruta fresca suculenta' },
            { icon: '🍑', title: 'Pêssego em Calda', category: 'frutas', keywords: 'pêssego fruta calda doce' },
            { icon: '🫐', title: 'Mirtilo / Blueberry', category: 'frutas', keywords: 'mirtilo blueberry fruta roxa silvestre' },
            { icon: '🥝', title: 'Kiwi Fatiado', category: 'frutas', keywords: 'kiwi verde fruta fatiado' },
            { icon: '🥥', title: 'Coco Ralado / Água de Coco', category: 'frutas', keywords: 'coco ralado água de coco fruta' },

            // BEBIDAS E SUCOS
            { icon: '🥤', title: 'Refrigerante / Suco', category: 'bebidas', keywords: 'copo refrigerante suco canudo gelado refrigerante lata coca guaraná' },
            { icon: '🧃', title: 'Suco de Caixinha / Néctar', category: 'bebidas', keywords: 'caixinha suco de caixinha néctar del valle' },
            { icon: '☕', title: 'Café Quentinho', category: 'bebidas', keywords: 'café expresso quente xícara cappuccino' },
            { icon: '🥛', title: 'Leite / Ninho', category: 'bebidas', keywords: 'leite ninho copo de leite garrafa vitamina' },
            { icon: '🧋', title: 'Milk-Shake / Bubble Tea', category: 'bebidas', keywords: 'bubble tea chá gelado milk shake batido sorvete' },
            { icon: '🍹', title: 'Drink Tropical / Coquetel', category: 'bebidas', keywords: 'drink tropical suco maracujá caipirinha coquetel' },
            { icon: '🍸', title: 'Taça de Coquetel', category: 'bebidas', keywords: 'coquetel drink martini taça' },
            { icon: '🍷', title: 'Taça de Vinho', category: 'bebidas', keywords: 'vinho taça tinto branco' },
            { icon: '🍺', title: 'Cerveja Gelada', category: 'bebidas', keywords: 'cerveja chopp gelada caneca lata long neck' },
            { icon: '🍻', title: 'Brinde com Chopp', category: 'bebidas', keywords: 'brinde cervejas chopp comemoração' },
            { icon: '🫖', title: 'Chá / Bule', category: 'bebidas', keywords: 'bule chá quente infusão' },
            { icon: '🧊', title: 'Gelo Refrescante', category: 'bebidas', keywords: 'gelo geladinho pedra de gelo refrescante trincando' },

            // SELOS, DESTAQUES E SÍMBOLOS
            { icon: '✨', title: 'Destaque / Especial', category: 'selos', keywords: 'brilho especial destaque novo novidade' },
            { icon: '⚡', title: 'Mais Vendido / Oferta Relâmpago', category: 'selos', keywords: 'raio rápido atenção promoção oferta mais vendido' },
            { icon: '🔥', title: 'Bombando / Em Alta', category: 'selos', keywords: 'fogo quente mais pedido bombando sucesso top' },
            { icon: '⭐', title: 'Favorito dos Clientes', category: 'selos', keywords: 'estrela favorito mais vendido top 5 estrelas' },
            { icon: '🌟', title: 'Super Recomendado', category: 'selos', keywords: 'estrela brilhante super destaque exclusivo' },
            { icon: '💥', title: 'Super Promoção', category: 'selos', keywords: 'explosão imperdível oferta desconto bomba' },
            { icon: '🎯', title: 'Escolha Certa', category: 'selos', keywords: 'alvo certo escolha perfeita campeão' },
            { icon: '🎁', title: 'Brinde / Presente', category: 'selos', keywords: 'presente brinde grátis bônus cortesia' },
            { icon: '💖', title: 'Feito com Amor', category: 'selos', keywords: 'coração feito com amor especial carinho' },
            { icon: '🏷️', title: 'Cupom / Tag de Desconto', category: 'selos', keywords: 'etiqueta tag desconto preço cupom' },
            { icon: '📢', title: 'Aviso / Comunicado', category: 'selos', keywords: 'megafone aviso importante comunicado novidade' },
            { icon: '🥇', title: '1º Lugar / O Melhor', category: 'selos', keywords: 'primeiro lugar número 1 campeão ouro' },
            { icon: '🏆', title: 'Campeão de Vendas', category: 'selos', keywords: 'troféu o melhor da cidade campeão' },
            { icon: '💯', title: '100% Qualidade Garantida', category: 'selos', keywords: 'cem por cento garantia qualidade perfeito' },
            { icon: '🆓', title: 'Item Grátis / Sem Custo', category: 'selos', keywords: 'grátis free sem custo 0 reais' },
            { icon: '👑', title: 'Linha Premium / Gourmet', category: 'selos', keywords: 'coroa rei premium vip nobre gourmet' },
            { icon: '🎉', title: 'Combo Festa / Especial', category: 'selos', keywords: 'festa comemoração combo família' },
            { icon: '✅', title: 'Confirmado / Verificado', category: 'selos', keywords: 'check verificado ok sim aprovado' },

            // DELIVERY, HORÁRIOS E PAGAMENTOS
            { icon: '🛵', title: 'Entrega Rápida / Motoboy', category: 'delivery', keywords: 'motoboy entrega rápida delivery moto rota' },
            { icon: '🛍️', title: 'Retirada no Balcão', category: 'delivery', keywords: 'sacola retirada embalagem balcão levar' },
            { icon: '🛒', title: 'Carrinho de Compras', category: 'delivery', keywords: 'carrinho pedido compras itens' },
            { icon: '⏰', title: 'Tempo / Horário', category: 'delivery', keywords: 'relógio tempo horário entregue em minutos agendamento' },
            { icon: '📍', title: 'Endereço / Bairro', category: 'delivery', keywords: 'localização endereço entrega mapa rua' },
            { icon: '💵', title: 'Dinheiro / PIX', category: 'delivery', keywords: 'dinheiro nota pagamento pix troco valor' },
            { icon: '💳', title: 'Cartão Crédito / Débito', category: 'delivery', keywords: 'cartão crédito débito maquininha aproximação' },
            { icon: '📦', title: 'Embalagem Segura', category: 'delivery', keywords: 'caixa pacote quentinha embalagem lacrada' },
            { icon: '💬', title: 'WhatsApp Atendimento', category: 'delivery', keywords: 'balão whatsapp atendimento contato suporte' },
            { icon: '🔔', title: 'Notificação de Pedido', category: 'delivery', keywords: 'sino notificação aviso novo pedido' },
            { icon: '💡', title: 'Dica do Chefe', category: 'delivery', keywords: 'dica ideia sugestão segredo' }
        ];

        let activeIconPickerCallback = null;
        let currentIconCategory = 'all';
        let currentlyHoveredIcon = null;

        function getRecentEmojis() {
            try {
                const recents = localStorage.getItem('don_recent_emojis');
                return recents ? JSON.parse(recents) : ['🍱', '🍧', '🥤', '🍔', '🍕', '🍳', '🥩', '🍓', '✨', '⚡', '🔥', '🛵'];
            } catch(e) {
                return ['🍱', '🍧', '🥤', '🍔', '🍕', '🍳', '🥩', '🍓', '✨', '⚡', '🔥', '🛵'];
            }
        }

        function saveRecentEmoji(emoji) {
            try {
                let recents = getRecentEmojis().filter(e => e !== emoji);
                recents.unshift(emoji);
                if (recents.length > 18) recents = recents.slice(0, 18);
                localStorage.setItem('don_recent_emojis', JSON.stringify(recents));
            } catch(e) {}
        }

        function openIconPicker(callback, defaultEmoji = null) {
            activeIconPickerCallback = callback;
            currentIconCategory = 'all';
            const searchEl = document.getElementById('iconPickerSearch');
            if (searchEl) searchEl.value = '';
            
            const clearBtn = document.getElementById('iconPickerSearchClear');
            if (clearBtn) clearBtn.style.display = 'none';

            renderIconPickerCategoriesUI();
            renderIconPickerGrid();

            // Configurar preview inicial
            const initialEmoji = defaultEmoji || '✨';
            const itemObj = ICON_COLLECTION.find(i => i.icon === initialEmoji) || { icon: initialEmoji, title: 'Ícone Selecionado', category: 'selos', keywords: '' };
            updateIconPreview(itemObj.icon, itemObj.title, itemObj.category, itemObj.keywords);

            const modal = document.getElementById('iconPickerModal');
            if (modal) {
                modal.style.display = 'flex';
                // Focar no campo de busca para digitação rápida
                setTimeout(() => {
                    if (searchEl) searchEl.focus();
                }, 100);
            }
        }

        function closeIconPickerModal() {
            const modal = document.getElementById('iconPickerModal');
            if (modal) modal.style.display = 'none';
            activeIconPickerCallback = null;
            currentlyHoveredIcon = null;
        }

        function renderIconPickerCategoriesUI() {
            const nav = document.getElementById('iconPickerCategories');
            if (!nav) return;

            const searchQuery = (document.getElementById('iconPickerSearch')?.value || '').toLowerCase().trim();

            nav.innerHTML = ICON_CATEGORIES.map(cat => {
                let count = 0;
                if (cat.id === 'all') {
                    count = ICON_COLLECTION.length;
                } else {
                    count = ICON_COLLECTION.filter(i => i.category === cat.id).length;
                }
                const isActive = currentIconCategory === cat.id;

                return `
                    <button type="button" class="icon-cat-btn ${isActive ? 'active' : ''}" onclick="selectIconCategory('${cat.id}', this)">
                        <span>${cat.icon}</span>
                        <span>${cat.name}</span>
                        <span class="badge-count">${count}</span>
                    </button>
                `;
            }).join('');
        }

        function selectIconCategory(catId, btnEl) {
            currentIconCategory = catId;
            const catBtns = document.querySelectorAll('#iconPickerCategories .icon-cat-btn');
            catBtns.forEach(btn => btn.classList.remove('active'));
            if (btnEl) btnEl.classList.add('active');
            renderIconPickerGrid();
        }

        function clearIconPickerSearch() {
            const searchEl = document.getElementById('iconPickerSearch');
            if (searchEl) {
                searchEl.value = '';
                searchEl.focus();
            }
            const clearBtn = document.getElementById('iconPickerSearchClear');
            if (clearBtn) clearBtn.style.display = 'none';
            renderIconPickerGrid();
        }

        function filterIconPickerList() {
            const searchEl = document.getElementById('iconPickerSearch');
            const clearBtn = document.getElementById('iconPickerSearchClear');
            if (searchEl && clearBtn) {
                clearBtn.style.display = searchEl.value.trim() ? 'flex' : 'none';
            }
            renderIconPickerGrid();
        }

        function updateIconPreview(emoji, title, category, keywords) {
            currentlyHoveredIcon = emoji;
            const emojiEl = document.getElementById('iconPreviewEmoji');
            const titleEl = document.getElementById('iconPreviewTitle');
            const subEl = document.getElementById('iconPreviewSub');

            if (emojiEl) emojiEl.textContent = emoji || '✨';
            if (titleEl) titleEl.textContent = title || 'Ícone Selecionado';
            if (subEl) {
                const catObj = ICON_CATEGORIES.find(c => c.id === category);
                const catName = catObj ? catObj.name : 'Geral';
                subEl.textContent = `Categoria: ${catName} • Clique para aplicar instantaneamente`;
            }
        }

        function renderIconPickerGrid() {
            const container = document.getElementById('iconPickerGrid');
            if (!container) return;

            const searchQuery = (document.getElementById('iconPickerSearch')?.value || '').toLowerCase().trim();

            // Filtrar itens
            let filtered = ICON_COLLECTION.filter(item => {
                const matchCat = (currentIconCategory === 'all' || item.category === currentIconCategory);
                const matchSearch = !searchQuery || 
                                     item.title.toLowerCase().includes(searchQuery) ||
                                     item.keywords.toLowerCase().includes(searchQuery) || 
                                     item.icon.includes(searchQuery);
                return matchCat && matchSearch;
            });

            if (filtered.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; color: var(--gray-600); padding: 2rem 1rem;">
                        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
                        <p style="font-weight: 700; color: #0F172A; margin: 0 0 0.25rem 0;">Nenhum emoji encontrado</p>
                        <p style="font-size: 0.8rem; color: #64748B; margin: 0 0 0.75rem 0;">Tente buscar por termos como: marmita, suco, burger, açai, fogo...</p>
                        <button type="button" class="btn-admin" onclick="clearIconPickerSearch()" style="background: #E2E8F0; color: #0F172A; font-size: 0.8rem; padding: 0.35rem 0.8rem;">Limpar Busca</button>
                    </div>
                `;
                return;
            }

            let html = '';

            // Se for categoria "all" e não tiver busca ativa, exibir seção de Recentes no topo + grupos
            if (currentIconCategory === 'all' && !searchQuery) {
                const recentList = getRecentEmojis();
                if (recentList.length > 0) {
                    html += `
                        <div class="icon-section-header">
                            <span>🌟</span>
                            <span>Acesso Rápido / Usados Recentemente</span>
                        </div>
                        <div class="icon-picker-grid">
                            ${recentList.map(recEmoji => {
                                const found = ICON_COLLECTION.find(i => i.icon === recEmoji) || { icon: recEmoji, title: 'Emoji Rápido', category: 'selos', keywords: '' };
                                return `
                                    <button type="button" class="icon-picker-item" 
                                            onclick="handleSelectIcon('${found.icon}')" 
                                            onmouseenter="updateIconPreview('${found.icon}', '${found.title.replace(/'/g, "\\'")}', '${found.category}', '${found.keywords.replace(/'/g, "\\'")}')"
                                            title="${found.title}">
                                        ${found.icon}
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    `;
                }

                // Agrupar por categorias
                const groupedCats = ICON_CATEGORIES.filter(c => c.id !== 'all');
                groupedCats.forEach(cat => {
                    const catItems = filtered.filter(i => i.category === cat.id);
                    if (catItems.length > 0) {
                        html += `
                            <div class="icon-section-header">
                                <span>${cat.icon}</span>
                                <span>${cat.name} (${catItems.length})</span>
                            </div>
                            <div class="icon-picker-grid">
                                ${catItems.map(item => `
                                    <button type="button" class="icon-picker-item" 
                                            onclick="handleSelectIcon('${item.icon}')" 
                                            onmouseenter="updateIconPreview('${item.icon}', '${item.title.replace(/'/g, "\\'")}', '${item.category}', '${item.keywords.replace(/'/g, "\\'")}')"
                                            title="${item.title} - ${item.keywords}">
                                        ${item.icon}
                                    </button>
                                `).join('')}
                            </div>
                        `;
                    }
                });
            } else {
                // Visualização em Grid direta com contagem no cabeçalho
                const currentCatObj = ICON_CATEGORIES.find(c => c.id === currentIconCategory) || { name: 'Resultados da Busca', icon: '🔍' };
                html += `
                    <div class="icon-section-header">
                        <span>${currentCatObj.icon}</span>
                        <span>${searchQuery ? `Resultados para "${searchQuery}"` : currentCatObj.name} (${filtered.length})</span>
                    </div>
                    <div class="icon-picker-grid">
                        ${filtered.map(item => `
                            <button type="button" class="icon-picker-item" 
                                    onclick="handleSelectIcon('${item.icon}')" 
                                    onmouseenter="updateIconPreview('${item.icon}', '${item.title.replace(/'/g, "\\'")}', '${item.category}', '${item.keywords.replace(/'/g, "\\'")}')"
                                    title="${item.title}">
                                ${item.icon}
                            </button>
                        `).join('')}
                    </div>
                `;
            }

            container.innerHTML = html;
        }

        function handleSelectIcon(emoji) {
            saveRecentEmoji(emoji);
            if (typeof activeIconPickerCallback === 'function') {
                activeIconPickerCallback(emoji);
            }
            closeIconPickerModal();
        }

        function handleConfirmSelectedIcon() {
            if (currentlyHoveredIcon) {
                handleSelectIcon(currentlyHoveredIcon);
            } else {
                closeIconPickerModal();
            }
        }

        function openIconPickerForInput(inputId) {
            const input = document.getElementById(inputId);
            const currentVal = input ? input.value.trim() : '✨';
            openIconPicker(function(selectedEmoji) {
                if (input) {
                    input.value = selectedEmoji;
                    input.dispatchEvent(new Event('input'));
                }
            }, currentVal);
        }

        function openIconPickerForExtrasCategoryChip(catIdx, chipIdx) {
            const currentCat = currentAdminExtrasCategories && currentAdminExtrasCategories[catIdx];
            const currentChip = currentCat && currentCat.chips && currentCat.chips[chipIdx];
            const currentVal = currentChip ? currentChip.icon : '✨';
            openIconPicker(function(selectedEmoji) {
                if (currentAdminExtrasCategories[catIdx] && currentAdminExtrasCategories[catIdx].chips[chipIdx]) {
                    currentAdminExtrasCategories[catIdx].chips[chipIdx].icon = selectedEmoji;
                    renderAdminExtrasCategoriesEditor();
                }
            }, currentVal);
        }

        function updateAdminExtrasCategoryTitle(catIdx, value) {
            if (currentAdminExtrasCategories[catIdx]) {
                currentAdminExtrasCategories[catIdx].name = value;
            }
        }

        function updateAdminExtrasCategoryChipField(catIdx, chipIdx, field, value) {
            if (currentAdminExtrasCategories[catIdx] && currentAdminExtrasCategories[catIdx].chips[chipIdx]) {
                currentAdminExtrasCategories[catIdx].chips[chipIdx][field] = value;
                if (field === 'price') {
                    const valClean = String(value).trim().toLowerCase();
                    if (valClean === '0' || valClean === '' || valClean === 'grátis' || valClean === 'gratis') {
                        currentAdminExtrasCategories[catIdx].chips[chipIdx].isFree = true;
                    } else {
                        currentAdminExtrasCategories[catIdx].chips[chipIdx].isFree = false;
                    }
                }
            }
        }

        function toggleAdminExtrasCategoryChipFree(catIdx, chipIdx) {
            if (currentAdminExtrasCategories[catIdx] && currentAdminExtrasCategories[catIdx].chips[chipIdx]) {
                const chip = currentAdminExtrasCategories[catIdx].chips[chipIdx];
                const isCurrentlyFree = (chip.isFree === true) || (chip.price === '' || chip.price === '0' || chip.price === 'Grátis' || chip.price === 'gratis');
                if (isCurrentlyFree) {
                    chip.price = '+R$ 3,00';
                    chip.isFree = false;
                } else {
                    chip.price = 'Grátis';
                    chip.isFree = true;
                }
                renderAdminExtrasCategoriesEditor();
            }
        }

        function addAdminExtrasCategoryBlock() {
            if (!currentAdminExtrasCategories) currentAdminExtrasCategories = [];
            currentAdminExtrasCategories.push({
                name: `Novo Bloco / Categoria ${currentAdminExtrasCategories.length + 1}`,
                chips: [
                    { icon: '✨', name: 'Item Exemplo', price: '' }
                ]
            });
            renderAdminExtrasCategoriesEditor();
            showNotification('Novo bloco de categoria adicionado! 🗂️', 'success');
        }

        async function removeAdminExtrasCategoryBlock(catIdx) {
            const cat = currentAdminExtrasCategories[catIdx];
            const name = cat ? cat.name : 'este bloco';
            const confirmed = await showCustomConfirm({
                title: 'Excluir Bloco de Categoria',
                message: `Tem certeza que deseja excluir o bloco "${name}" e todos os seus itens?`,
                icon: '🗑️',
                confirmText: 'Sim, Excluir',
                cancelText: 'Cancelar'
            });
            if (confirmed) {
                currentAdminExtrasCategories.splice(catIdx, 1);
                renderAdminExtrasCategoriesEditor();
                showNotification('Bloco de categoria removido! 🗑️', 'info');
            }
        }

        function addAdminExtrasChipToCategory(catIdx) {
            if (currentAdminExtrasCategories[catIdx]) {
                if (!Array.isArray(currentAdminExtrasCategories[catIdx].chips)) {
                    currentAdminExtrasCategories[catIdx].chips = [];
                }
                currentAdminExtrasCategories[catIdx].chips.push({
                    icon: '✨',
                    name: 'Novo Item',
                    price: '+R$ 3,00'
                });
                renderAdminExtrasCategoriesEditor();
            }
        }

        function removeAdminExtrasChipFromCategory(catIdx, chipIdx) {
            if (currentAdminExtrasCategories[catIdx] && currentAdminExtrasCategories[catIdx].chips) {
                currentAdminExtrasCategories[catIdx].chips.splice(chipIdx, 1);
                renderAdminExtrasCategoriesEditor();
            }
        }

        function openIconPickerForExtrasChip(index) {
            if (currentAdminExtrasCategories[0] && currentAdminExtrasCategories[0].chips[index]) {
                openIconPickerForExtrasCategoryChip(0, index);
            }
        }

        function appendIconToInput(inputId) {
            const input = document.getElementById(inputId);
            openIconPicker(function(selectedEmoji) {
                if (input) {
                    input.value = selectedEmoji + ' ' + input.value.trim();
                    input.dispatchEvent(new Event('input'));
                }
            });
        }

        function updateAdminExtrasChipField(index, field, value) {
            if (currentAdminExtrasCategories[0] && currentAdminExtrasCategories[0].chips[index]) {
                currentAdminExtrasCategories[0].chips[index][field] = value;
            }
        }

        function addAdminExtrasChipRow() {
            if (!currentAdminExtrasCategories || currentAdminExtrasCategories.length === 0) {
                addAdminExtrasCategoryBlock();
            } else {
                addAdminExtrasChipToCategory(0);
            }
        }

        function removeAdminExtrasChipRow(index) {
            if (currentAdminExtrasCategories[0] && currentAdminExtrasCategories[0].chips) {
                removeAdminExtrasChipFromCategory(0, index);
            }
        }

        function resetPromoBannerToCategoryDefault() {
            const presetKey = getActiveCompanyPresetType();
            const defaultData = PROMO_PRESETS[presetKey] || PROMO_PRESETS.acai;

            document.getElementById('promoBannerEnabled').checked = true;
            document.getElementById('promoBannerBadge').value = defaultData.badge;
            document.getElementById('promoBannerTitle').value = defaultData.title;
            document.getElementById('promoBannerSubtitle').value = defaultData.subtitle;
            document.getElementById('promoBannerFooter').value = defaultData.footerNote;

            const cards = defaultData.cards || [];
            document.getElementById('promoCard1Icon').value = cards[0]?.icon || '';
            document.getElementById('promoCard1Title').value = cards[0]?.title || '';
            document.getElementById('promoCard1Desc').value = cards[0]?.desc || '';

            document.getElementById('promoCard2Icon').value = cards[1]?.icon || '';
            document.getElementById('promoCard2Title').value = cards[1]?.title || '';
            document.getElementById('promoCard2Desc').value = cards[1]?.desc || '';

            document.getElementById('promoCard3Icon').value = cards[2]?.icon || '';
            document.getElementById('promoCard3Title').value = cards[2]?.title || '';
            document.getElementById('promoCard3Desc').value = cards[2]?.desc || '';

            settings.customBanner = null;
            saveData();
            renderDynamicPromoBanner();
            showNotification('Banner promocional restaurado para o padrão da categoria! 🔄', 'info');
        }

        function resetExtrasSectionToCategoryDefault() {
            const presetKey = getActiveCompanyPresetType();
            const defaultData = EXTRAS_PRESETS[presetKey] || EXTRAS_PRESETS.acai;

            document.getElementById('extrasSectionEnabled').checked = true;
            document.getElementById('extrasSectionBadge').value = defaultData.badge || '';
            document.getElementById('extrasSectionTitle').value = defaultData.title || '';
            document.getElementById('extrasSectionDesc').value = defaultData.desc || '';
            if (document.getElementById('extrasFreeLimit')) {
                document.getElementById('extrasFreeLimit').value = '3';
            }

            if (defaultData.categories && Array.isArray(defaultData.categories)) {
                currentAdminExtrasCategories = JSON.parse(JSON.stringify(defaultData.categories));
            } else {
                currentAdminExtrasCategories = [{
                    name: '🍳 Acompanhamentos e Adicionais',
                    chips: []
                }];
            }
            renderAdminExtrasCategoriesEditor();

            settings.customExtras = null;
            saveData();
            renderDynamicIngredientsSection();
            showNotification('Seção de acompanhamentos restaurada para o padrão da categoria! 🔄', 'info');
        }

        // ========== MODAL DE CONFIRMAÇÃO SEGURO (NUNCA BLOQUEADO POR IFRAME OU NAVEGADOR) ==========
        let customConfirmResolve = null;

        function showCustomConfirm(options) {
            return new Promise((resolve) => {
                customConfirmResolve = resolve;
                const modal = document.getElementById('customConfirmModal');
                const titleEl = document.getElementById('customConfirmTitle');
                const msgEl = document.getElementById('customConfirmMessage');
                const iconEl = document.getElementById('customConfirmIcon');
                const okBtn = document.getElementById('customConfirmOkBtn');
                const cancelBtn = document.getElementById('customConfirmCancelBtn');

                if (!modal) {
                    // Fallback se elemento não estiver presente
                    resolve(true);
                    return;
                }

                if (typeof options === 'string') {
                    options = { message: options };
                }

                if (titleEl) titleEl.textContent = options.title || 'Confirmar Exclusão';
                if (msgEl) msgEl.textContent = options.message || 'Deseja realmente excluir este item?';
                if (iconEl) iconEl.textContent = options.icon || '🗑️';
                if (okBtn) okBtn.textContent = options.confirmText || 'Sim, Excluir';
                if (cancelBtn) cancelBtn.textContent = options.cancelText || 'Cancelar';

                modal.style.display = 'flex';
            });
        }

        function closeCustomConfirm(result) {
            const modal = document.getElementById('customConfirmModal');
            if (modal) modal.style.display = 'none';
            if (customConfirmResolve) {
                customConfirmResolve(result);
                customConfirmResolve = null;
            }
        }

        // ========== NOTIFICAÇÕES ==========
        function showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `alert alert-${type}`;
            notification.style.cssText = 'position: fixed; top: 100px; right: 20px; z-index: 9999; min-width: 300px; animation: fadeInUp 0.5s;';
            notification.innerHTML = `<strong>✓</strong> ${message}`;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        function triggerCartShake() {
            const btn = document.getElementById('cartBtn');
            if (!btn) return;
            btn.classList.remove('cart-shake');
            void btn.offsetWidth; // Forçar reflow para reiniciar animação
            btn.classList.add('cart-shake');
            setTimeout(() => {
                btn.classList.remove('cart-shake');
            }, 650);
        }

        // ========== GERENCIAR CARRINHO ==========
        function addToCart(productId) {
            const activeComp = (typeof companies !== 'undefined' && companies.find(c => c.id === activeCompanyId)) || settings;
            const isCurrentDemo = isCompanyDemo(activeComp);
            if (isCurrentDemo && !DemoTrialManager.isTrialActive()) {
                openDemoLeadModal();
                showNotification('📱 Digite seu número para liberar o cardápio e testar por 24h!', 'info');
                return;
            }

            const product = products.find(p => p.id === productId);
            if (!product || !product.available) return;

            if (product.isAcai || product.name.toLowerCase().includes('açaí')) {
                openAcaiCustomizer(productId);
                return;
            }

            const existingItem = cart.find(item => item.productId === productId && !item.details);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id: Date.now(),
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
            triggerCartShake();
            
            cartCount.style.animation = 'none';
            setTimeout(() => {
                cartCount.style.animation = 'bounce 0.5s';
            }, 10);
        }

        function updateQuantity(productId, delta) {
            const item = cart.find(item => item.id === productId);
            if (!item) return;

            item.quantity += delta;

            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartUI();
            }
        }

        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
        }

        async function clearCart() {
            const confirmed = await showCustomConfirm({
                title: 'Limpar Carrinho',
                message: 'Deseja realmente remover todos os itens do seu carrinho?',
                icon: '🛒',
                confirmText: 'Sim, Limpar',
                cancelText: 'Voltar'
            });
            if (confirmed) {
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartUI();
            }
        }

        // ========== SELEÇÃO DE FORMA DE PAGAMENTO ==========
        let selectedPaymentMethod = 'PIX';
        let cashChangeFor = '';

        function selectPaymentMethod(method) {
            selectedPaymentMethod = method;
            renderPaymentSelectionUI();
        }

        function updateCashChangeValue(val) {
            cashChangeFor = val;
        }

        function renderPaymentSelectionUI() {
            const container = document.getElementById('paymentSelectionContainer');
            if (!container) return;

            container.innerHTML = `
                <div style="margin: 0.85rem 0; background: var(--white); border: 1px solid var(--gray-200); border-radius: 8px; padding: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="font-size: 0.82rem; font-weight: 800; color: var(--primary-dark); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
                        💳 Forma de Pagamento *
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem;">
                        <button type="button" onclick="selectPaymentMethod('PIX')" style="padding: 0.45rem 0.6rem; border-radius: 6px; border: 1.5px solid ${selectedPaymentMethod === 'PIX' ? 'var(--primary)' : 'var(--gray-300)'}; background: ${selectedPaymentMethod === 'PIX' ? 'var(--bg-accent, #FAF5FF)' : '#FFF'}; color: ${selectedPaymentMethod === 'PIX' ? 'var(--primary)' : 'var(--gray-700)'}; font-weight: 700; font-size: 0.78rem; cursor: pointer; display: flex; align-items: center; gap: 0.3rem; justify-content: center;">
                            🟢 Pix
                        </button>
                        <button type="button" onclick="selectPaymentMethod('CREDIT')" style="padding: 0.45rem 0.6rem; border-radius: 6px; border: 1.5px solid ${selectedPaymentMethod === 'CREDIT' ? 'var(--primary)' : 'var(--gray-300)'}; background: ${selectedPaymentMethod === 'CREDIT' ? 'var(--bg-accent, #FAF5FF)' : '#FFF'}; color: ${selectedPaymentMethod === 'CREDIT' ? 'var(--primary)' : 'var(--gray-700)'}; font-weight: 700; font-size: 0.78rem; cursor: pointer; display: flex; align-items: center; gap: 0.3rem; justify-content: center;">
                            💳 Crédito
                        </button>
                        <button type="button" onclick="selectPaymentMethod('DEBIT')" style="padding: 0.45rem 0.6rem; border-radius: 6px; border: 1.5px solid ${selectedPaymentMethod === 'DEBIT' ? 'var(--primary)' : 'var(--gray-300)'}; background: ${selectedPaymentMethod === 'DEBIT' ? 'var(--bg-accent, #FAF5FF)' : '#FFF'}; color: ${selectedPaymentMethod === 'DEBIT' ? 'var(--primary)' : 'var(--gray-700)'}; font-weight: 700; font-size: 0.78rem; cursor: pointer; display: flex; align-items: center; gap: 0.3rem; justify-content: center;">
                            💳 Débito
                        </button>
                        <button type="button" onclick="selectPaymentMethod('CASH')" style="padding: 0.45rem 0.6rem; border-radius: 6px; border: 1.5px solid ${selectedPaymentMethod === 'CASH' ? 'var(--primary)' : 'var(--gray-300)'}; background: ${selectedPaymentMethod === 'CASH' ? 'var(--bg-accent, #FAF5FF)' : '#FFF'}; color: ${selectedPaymentMethod === 'CASH' ? 'var(--primary)' : 'var(--gray-700)'}; font-weight: 700; font-size: 0.78rem; cursor: pointer; display: flex; align-items: center; gap: 0.3rem; justify-content: center;">
                            💵 Dinheiro
                        </button>
                    </div>
                    ${selectedPaymentMethod === 'CASH' ? `
                        <div style="margin-top: 0.5rem; animation: fadeIn 0.3s;">
                            <label style="font-size: 0.75rem; font-weight: 700; color: var(--gray-700); display: block; margin-bottom: 0.2rem;">Troco para quanto?</label>
                            <input type="text" value="${cashChangeFor}" oninput="updateCashChangeValue(this.value)" placeholder="Ex: R$ 50,00 ou Não preciso de troco" style="width: 100%; padding: 0.4rem 0.6rem; border: 1px solid var(--gray-300); border-radius: 6px; font-size: 0.8rem;">
                        </div>
                    ` : ''}
                </div>
            `;
        }

        function getFormattedPaymentMethod() {
            switch (selectedPaymentMethod) {
                case 'PIX': return 'Pix (Pagamento na Entrega ou QR Code)';
                case 'CREDIT': return 'Cartão de Crédito (Maquininha na Entrega)';
                case 'DEBIT': return 'Cartão de Débito (Maquininha na Entrega)';
                case 'CASH':
                    const changeStr = cashChangeFor.trim() ? ` (Troco para: ${cashChangeFor.trim()})` : ' (Sem necessidade de troco)';
                    return `Dinheiro${changeStr}`;
                default: return 'Pix';
            }
        }

        // ========== SISTEMA DE CUPONS DE DESCONTO NO CARRINHO ==========
        function renderCartCouponUI(subtotal = 0) {
            const container = document.getElementById('cartCouponContainer');
            if (!container) return;

            if (appliedCoupon && appliedCoupon.discount > 0) {
                const discountVal = (subtotal * appliedCoupon.discount) / 100;
                container.innerHTML = `
                    <div class="cart-coupon-box">
                        <div class="applied-coupon-card">
                            <div class="applied-coupon-info">
                                <div class="applied-coupon-code">
                                    <span>🏷️ ${appliedCoupon.code}</span>
                                    <span class="applied-coupon-tag">${appliedCoupon.discount}% OFF</span>
                                </div>
                                <div class="applied-coupon-discount">
                                    Desconto de <strong>-R$ ${discountVal.toFixed(2).replace('.', ',')}</strong> aplicado no pedido!
                                </div>
                            </div>
                            <button type="button" class="btn-remove-coupon" onclick="removeAppliedCoupon()" title="Remover cupom">✕</button>
                        </div>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="cart-coupon-box">
                        <div class="cart-coupon-header">
                            <span>🏷️ Possui Cupom de Desconto?</span>
                        </div>
                        <div class="cart-coupon-input-group">
                            <input type="text" class="cart-coupon-input" id="cartCouponInput" placeholder="Ex: BEMVINDO10" maxlength="20" onkeypress="if(event.key === 'Enter'){ event.preventDefault(); applyCartCoupon(); }">
                            <button type="button" class="btn-apply-coupon" onclick="applyCartCoupon()">Aplicar</button>
                        </div>
                    </div>
                `;
            }
        }

        function applyCartCoupon(codeOverride) {
            let code = codeOverride;
            if (!code) {
                const input = document.getElementById('cartCouponInput');
                if (input) code = input.value;
            }

            const cleanCode = DefensiveUtils.safeString(code, 30);
            if (!cleanCode) {
                showNotification('Digite o código do cupom!', 'warning');
                return;
            }

            const availableCoupons = DefensiveUtils.safeArray(settings.coupons || defaultCoupons);
            const subtotal = CartOrderCalculator.calculateSubtotal(cart);

            const result = CouponEngine.validateAndCalculateCoupon({
                couponCode: cleanCode,
                subtotal,
                availableCoupons
            });

            if (!result.isValid) {
                showNotification(result.error || `❌ Cupom "${cleanCode}" inválido!`, 'warning');
                return;
            }

            appliedCoupon = {
                code: result.code,
                discount: result.discount,
                description: result.description
            };

            saveData();
            updateCartUI();

            showNotification(`🎉 Cupom "${result.code}" aplicado! ${result.discount}% de desconto (-${DefensiveUtils.formatCurrency(result.discountValue)})`, 'success');
        }

        function removeAppliedCoupon() {
            if (!appliedCoupon) return;
            const removedCode = DefensiveUtils.safeString(appliedCoupon.code, 30);
            appliedCoupon = null;
            if (activeCompanyId) localStorage.removeItem(`appliedCoupon_${activeCompanyId}`);
            saveData();
            updateCartUI();
            showNotification(`Cupom "${removedCode}" removido.`, 'info');
        }

        function getActiveDeliveryInfo() {
            const list = DefensiveUtils.safeArray(
                (settings.deliveryNeighborhoods && settings.deliveryNeighborhoods.length > 0) 
                    ? settings.deliveryNeighborhoods 
                    : DEFAULT_DELIVERY_NEIGHBORHOODS
            );

            // 1. Tentar pegar do select atual no DOM se existir
            const selectEl = document.getElementById('customerNeighborhood');
            let selectedId = selectEl ? selectEl.value : null;

            // 2. Se não tiver no DOM ou se selectEl estiver vazio, tentar pegar dos dados do cliente salvos
            if (!selectedId && customerData && customerData.neighborhoodId) {
                selectedId = customerData.neighborhoodId;
            }

            const customInput = document.getElementById('customerCustomNeighborhood');
            const customName = customInput ? customInput.value.trim() : '';

            return DeliveryFeeEngine.calculateDeliveryFee({
                selectedNeighborhoodId: selectedId,
                customNeighborhoodName: customName,
                neighborhoodsList: list,
                defaultFee: settings.deliveryFee,
                defaultTime: settings.deliveryTime,
                customerData: customerData
            });
        }

        function handleCustomerNeighborhoodChange(val) {
            const customWrap = document.getElementById('customerCustomNeighborhoodWrapper');
            const customInput = document.getElementById('customerCustomNeighborhood');
            if (customWrap) {
                if (val === 'other') {
                    customWrap.style.display = 'block';
                    if (customInput) {
                        customInput.required = true;
                        customInput.focus();
                    }
                } else {
                    customWrap.style.display = 'none';
                    if (customInput) {
                        customInput.required = false;
                        customInput.value = '';
                    }
                }
            }

            const badgeEl = document.getElementById('customerNeighborhoodBadge');
            const info = getActiveDeliveryInfo();
            if (badgeEl) {
                if (val && val !== '') {
                    badgeEl.style.display = 'block';
                    badgeEl.innerHTML = `🛵 Frete: <strong>${DefensiveUtils.formatCurrency(info.fee)}</strong> | ⏱️ Previsão: <strong>${DefensiveUtils.escapeHtml(info.time)}</strong>`;
                } else {
                    badgeEl.style.display = 'none';
                }
            }

            // Atualiza valores do carrinho sem recriar os campos do formulário
            updateCartUI(false);
        }

        function updateCartUI(forceFormRender = false) {
            const safeCart = DefensiveUtils.safeArray(cart);
            const deliveryInfo = getActiveDeliveryInfo();
            const availableCoupons = DefensiveUtils.safeArray(settings.coupons || defaultCoupons);

            const totals = CartOrderCalculator.calculateFullOrderBreakdown({
                cart: safeCart,
                appliedCoupon,
                deliveryInfo,
                availableCoupons
            });

            // Se o cupom tiver se tornado inválido, atualizar estado
            if (appliedCoupon && !totals.couponInfo.isValid) {
                appliedCoupon = null;
                if (activeCompanyId) localStorage.removeItem(`appliedCoupon_${activeCompanyId}`);
            }

            cartCount.textContent = totals.totalItems;
            cartCount.style.display = totals.totalItems > 0 ? 'flex' : 'none';

            if (safeCart.length === 0) {
                cartItems.innerHTML = `
                    <div class="cart-empty">
                        <div class="cart-empty-icon">🛒</div>
                        <p>Seu carrinho está vazio</p>
                    </div>
                `;
                cartFooter.style.display = 'none';
            } else {
                cartItems.innerHTML = safeCart.map(item => {
                    const price = DefensiveUtils.safeNumber(item.price, 0);
                    const qty = DefensiveUtils.safeInteger(item.quantity, 1);
                    const itemSubtotal = price * qty;
                    const cleanName = DefensiveUtils.escapeHtml(item.name || 'Item');
                    const cleanDetails = item.details ? DefensiveUtils.escapeHtml(item.details) : '';
                    const cleanImg = item.image ? DefensiveUtils.escapeHtml(item.image) : 'acai_300ml.svg';

                    return `
                    <div class="cart-item">
                        <img src="${cleanImg}" alt="${cleanName}" class="cart-item-image">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${cleanName}</div>
                            ${cleanDetails ? `<div style="font-size: 0.8rem; color: #6B21A8; font-weight: 600; margin-top: 3px; background: #FAF5FF; padding: 4px 8px; border-radius: 6px; border: 1px solid #E9D5FF;">🥣 ${cleanDetails}</div>` : ''}
                            <div class="cart-item-price" style="margin-top: 4px;">${DefensiveUtils.formatCurrency(price)}</div>
                            <div class="cart-item-controls">
                                <button class="cart-item-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                                <span class="cart-item-quantity">${qty}</span>
                                <button class="cart-item-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">🗑️</button>
                            </div>
                        </div>
                        <div class="cart-item-total">
                            ${DefensiveUtils.formatCurrency(itemSubtotal)}
                        </div>
                    </div>
                `;
                }).join('');
                
                cartFooter.style.display = 'block';
                renderCustomerForm(forceFormRender);
            }

            const discountRow = document.getElementById('cartDiscountRow');
            const discountLabel = document.getElementById('cartDiscountLabel');
            const discountValEl = document.getElementById('cartDiscountValue');

            if (discountRow) {
                if (totals.couponInfo.isValid && totals.discountValue > 0) {
                    discountRow.style.display = 'flex';
                    if (discountLabel) discountLabel.textContent = `🏷️ Desconto (${totals.couponInfo.discount}% - ${totals.couponInfo.code}):`;
                    if (discountValEl) discountValEl.textContent = `-${DefensiveUtils.formatCurrency(totals.discountValue)}`;
                } else {
                    discountRow.style.display = 'none';
                }
            }

            const estTimeEl = document.getElementById('cartEstimatedTime');
            if (estTimeEl) estTimeEl.textContent = totals.deliveryTime;

            cartSubtotal.textContent = DefensiveUtils.formatCurrency(totals.subtotal);
            cartDeliveryFee.textContent = DefensiveUtils.formatCurrency(totals.deliveryFee);
            cartTotal.textContent = DefensiveUtils.formatCurrency(totals.finalTotal);
            
            renderCartCouponUI(totals.subtotal);
            renderPaymentSelectionUI();
            updateCheckoutButton();
        }

        // ========== AUTENTICAÇÃO E ÁREA DO CLIENTE ==========
        function updateCustomerHeaderUI() {
            const container = document.getElementById('customerHeaderContainer');
            if (container) {
                if (currentAppView === 'landing' || currentAppView === 'login') {
                    container.style.display = 'none';
                    container.innerHTML = '';
                    updateAdminHeaderUI();
                    return;
                }

                // Se logado como Administrador de Empresa, esconde a seção de cliente do topo
                if (AuthManager.isCompanyOwner(activeCompanyId) || AuthManager.isSuperAdmin()) {
                    container.innerHTML = '';
                    container.style.display = 'none';
                    updateAdminHeaderUI();
                    return;
                }

                container.style.display = 'block';
                if (loggedCustomer) {
                    const firstName = loggedCustomer.name ? loggedCustomer.name.trim().split(' ')[0] : 'Cliente';
                    container.innerHTML = `
                        <button class="customer-header-btn" onclick="openCustomerOrdersModal()" title="Ver Meus Pedidos">
                            Olá, ${escapeHtml(firstName)} | Pedidos
                        </button>
                    `;
                } else {
                    // Botão unificado "Entrar"
                    container.innerHTML = `
                        <button class="customer-header-btn unified-auth-header-btn" id="unifiedHeaderAuthBtn" onclick="openCustomerAuthModal('login', 'customer')" title="Entrar na sua conta ou painel da loja">
                            <span>👤</span> Entrar
                        </button>
                    `;
                }
            }
            updateAdminHeaderUI();
        }

        // ========== MENU MOBILE AGRUPADO ==========
        function updateMobileHeaderMenuUI() {
            const btn = document.getElementById('mobileHeaderMenuBtn');
            const icon = document.getElementById('mobileMenuIcon');
            const text = document.getElementById('mobileMenuText');
            const dropdown = document.getElementById('mobileHeaderDropdown');
            if (!btn || !dropdown) return;

            // Define o visual do botão principal agrupado
            if (isAdminLoggedIn) {
                const activeComp = companies.find(c => c.id === activeCompanyId) || settings;
                const storeName = activeComp.name || settings.restaurantName || 'Painel';
                if (icon) icon.textContent = '⚙️';
                if (text) text.textContent = storeName.length > 10 ? storeName.substring(0, 10) + '...' : storeName;
            } else if (loggedCustomer) {
                const firstName = loggedCustomer.name ? loggedCustomer.name.trim().split(' ')[0] : 'Conta';
                if (icon) icon.textContent = '👤';
                if (text) text.textContent = firstName.length > 10 ? firstName.substring(0, 10) + '...' : firstName;
            } else {
                if (icon) icon.textContent = '👤';
                if (text) text.textContent = 'Entrar';
            }

            // Constrói as opções organizadas dentro do Dropdown Mobile
            let itemsHtml = '';

            // SEÇÃO 1: CLIENTE
            itemsHtml += `<div class="mobile-dropdown-header">Área do Cliente</div>`;
            if (loggedCustomer) {
                const firstName = loggedCustomer.name ? loggedCustomer.name.trim().split(' ')[0] : 'Cliente';
                itemsHtml += `
                    <button type="button" class="mobile-dropdown-item primary-action" onclick="closeMobileHeaderMenu(); openCustomerOrdersModal();">
                        📦 Meus Pedidos (${escapeHtml(firstName)})
                    </button>
                    <button type="button" class="mobile-dropdown-item danger-action" onclick="closeMobileHeaderMenu(); logoutCustomer();">
                        🚪 Sair da Conta
                    </button>
                `;
            } else {
                itemsHtml += `
                    <button type="button" class="mobile-dropdown-item primary-action" onclick="closeMobileHeaderMenu(); openCustomerAuthModal('login', 'customer');">
                        👤 Entrar / Cadastrar (Cliente)
                    </button>
                `;
            }

            // SEÇÃO 2: EMPRESA / GESTÃO (Apenas quando não for cliente autenticado)
            if (!loggedCustomer) {
                itemsHtml += `<div class="mobile-dropdown-divider"></div>`;
                itemsHtml += `<div class="mobile-dropdown-header">Empresa / Gestão</div>`;
                if (isAdminLoggedIn) {
                    itemsHtml += `
                        <button type="button" class="mobile-dropdown-item admin-action" onclick="closeMobileHeaderMenu(); adminPanel.classList.add('active'); adminOverlay.classList.add('active'); renderPresetCatalog();">
                            ⚙️ Abrir Painel da Loja
                        </button>
                        <button type="button" class="mobile-dropdown-item danger-action" onclick="closeMobileHeaderMenu(); logoutAdmin();">
                            🚪 Sair da Empresa
                        </button>
                    `;
                } else {
                    itemsHtml += `
                        <button type="button" class="mobile-dropdown-item admin-action" onclick="closeMobileHeaderMenu(); openCustomerAuthModal('login', 'company');">
                            🏬 Login Empresa
                        </button>
                    `;
                }
            }

            dropdown.innerHTML = itemsHtml;
        }

        function toggleMobileHeaderMenu(e) {
            if (e) e.stopPropagation();
            const container = document.getElementById('mobileHeaderMenuContainer');
            const dropdown = document.getElementById('mobileHeaderDropdown');
            const btn = document.getElementById('mobileHeaderMenuBtn');
            if (!dropdown || !container) return;

            const isOpen = dropdown.classList.contains('active');
            if (isOpen) {
                closeMobileHeaderMenu();
            } else {
                dropdown.classList.add('active');
                container.classList.add('open');
                if (btn) btn.setAttribute('aria-expanded', 'true');
            }
        }

        function closeMobileHeaderMenu() {
            const container = document.getElementById('mobileHeaderMenuContainer');
            const dropdown = document.getElementById('mobileHeaderDropdown');
            const btn = document.getElementById('mobileHeaderMenuBtn');
            if (dropdown) dropdown.classList.remove('active');
            if (container) container.classList.remove('open');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }

        // Fechar dropdown ao clicar fora
        document.addEventListener('click', function(e) {
            const container = document.getElementById('mobileHeaderMenuContainer');
            if (container && !container.contains(e.target)) {
                closeMobileHeaderMenu();
            }
        });

        // Alternância de Perfil (Cliente vs Empresa) no Modal Unificado
        function switchAuthProfile(profile = 'customer') {
            const tabCust = document.getElementById('profileTabCustomer');
            const tabComp = document.getElementById('profileTabCompany');
            const secCust = document.getElementById('authCustomerSection');
            const secComp = document.getElementById('authCompanySection');
            const title = document.getElementById('authModalTitle');

            if (profile === 'company') {
                if (tabComp) tabComp.classList.add('active');
                if (tabCust) tabCust.classList.remove('active');
                if (secComp) secComp.style.display = 'block';
                if (secCust) secCust.style.display = 'none';
                if (title) title.textContent = '🏬 Acesso da Empresa';
                const err = document.getElementById('unifiedCompLoginError');
                if (err) err.style.display = 'none';
                const input = document.getElementById('unifiedCompLoginEmail');
                if (input) setTimeout(() => input.focus(), 50);
            } else {
                if (tabCust) tabCust.classList.add('active');
                if (tabComp) tabComp.classList.remove('active');
                if (secCust) secCust.style.display = 'block';
                if (secComp) secComp.style.display = 'none';
                if (title) title.textContent = '👤 Entrar';
            }
        }

        function openCustomerAuthModal(tab = 'login', profile = 'customer') {
            switchAuthProfile(profile);
            if (profile === 'customer') {
                switchAuthTab(tab);
            }
            const modal = document.getElementById('customerAuthModal');
            if (modal) modal.classList.add('active');
        }

        function closeCustomerAuthModal() {
            const modal = document.getElementById('customerAuthModal');
            if (modal) modal.classList.remove('active');
        }

        function populateAuthRegisterNeighborhoods() {
            const selectEl = document.getElementById('authRegisterNeighborhood');
            if (!selectEl) return;

            const list = (settings.deliveryNeighborhoods && settings.deliveryNeighborhoods.length > 0) 
                         ? settings.deliveryNeighborhoods 
                         : DEFAULT_DELIVERY_NEIGHBORHOODS;
            const activeList = list.filter(n => n.active !== false);

            const centroItems = activeList.filter(n => n.zone === 'centro');
            const zonaSulItems = activeList.filter(n => n.zone === 'zona_sul');
            const zonaNorteItems = activeList.filter(n => n.zone === 'zona_norte');
            const outrosItems = activeList.filter(n => n.zone !== 'centro' && n.zone !== 'zona_sul' && n.zone !== 'zona_norte');

            const renderOptions = (items) => items.map(n => `<option value="${n.id}">${n.name}</option>`).join('');

            selectEl.innerHTML = `
                <option value="">Selecione seu Bairro *</option>
                ${centroItems.length > 0 ? `<optgroup label="🏙️ Centro">${renderOptions(centroItems)}</optgroup>` : ''}
                ${zonaSulItems.length > 0 ? `<optgroup label="🌊 Zona Sul">${renderOptions(zonaSulItems)}</optgroup>` : ''}
                ${zonaNorteItems.length > 0 ? `<optgroup label="🌳 Zona Norte">${renderOptions(zonaNorteItems)}</optgroup>` : ''}
                ${outrosItems.length > 0 ? `<optgroup label="➕ Outras Regiões">${renderOptions(outrosItems)}</optgroup>` : ''}
                <option value="other">Outro Bairro</option>
            `;
        }

        function handleAuthRegisterNeighborhoodChange(val) {
            const customWrap = document.getElementById('authRegisterCustomNeighborhoodWrapper');
            const customInput = document.getElementById('authRegisterCustomNeighborhood');
            if (customWrap) {
                if (val === 'other') {
                    customWrap.style.display = 'block';
                    if (customInput) {
                        customInput.required = true;
                        customInput.focus();
                    }
                } else {
                    customWrap.style.display = 'none';
                    if (customInput) {
                        customInput.required = false;
                        customInput.value = '';
                    }
                }
            }
        }

        function switchAuthTab(tab) {
            const tabLogin = document.getElementById('tabBtnLogin');
            const tabRegister = document.getElementById('tabBtnRegister');
            const formLogin = document.getElementById('customerLoginForm');
            const formRegister = document.getElementById('customerRegisterForm');

            if (!tabLogin || !tabRegister || !formLogin || !formRegister) return;

            if (tab === 'login') {
                tabLogin.classList.add('active');
                tabRegister.classList.remove('active');
                formLogin.style.display = 'block';
                formRegister.style.display = 'none';
                document.getElementById('authModalTitle').textContent = '🔑 Entrar na Conta';
            } else {
                tabRegister.classList.add('active');
                tabLogin.classList.remove('active');
                formLogin.style.display = 'none';
                formRegister.style.display = 'block';
                document.getElementById('authModalTitle').textContent = '✨ Criar Cadastro';
                populateAuthRegisterNeighborhoods();
            }
        }

        // Sanitização contra XSS (Prevenção de injeção no DOM)
        function escapeHtml(str) {
            if (str === null || str === undefined) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        // ========== LOGIN E CADASTRO COM CONTA GOOGLE (OAUTH REAL + SELETOR NATIVO) ==========
        let isGoogleAuthListenerActive = false;
        let googleGsiLoadedClientId = null;

        function parseJwtPayload(token) {
            try {
                if (!token || typeof token !== 'string' || !token.includes('.')) return null;
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                return JSON.parse(jsonPayload);
            } catch (e) {
                console.warn('Não foi possível decodificar JWT Google:', e);
                return null;
            }
        }

        function loadGoogleGsiScript(clientId) {
            if (!clientId || googleGsiLoadedClientId === clientId) return;
            googleGsiLoadedClientId = clientId;

            if (!document.getElementById('googleGsiScript')) {
                const script = document.createElement('script');
                script.id = 'googleGsiScript';
                script.src = 'https://accounts.google.com/gsi/client';
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    try {
                        if (window.google && window.google.accounts && window.google.accounts.id) {
                            window.google.accounts.id.initialize({
                                client_id: clientId,
                                callback: (response) => {
                                    if (response && response.credential) {
                                        const payload = parseJwtPayload(response.credential);
                                        if (payload) {
                                            processGoogleCustomerAuth({
                                                name: payload.name || payload.given_name,
                                                email: payload.email,
                                                picture: payload.picture,
                                                googleId: payload.sub,
                                                provider: 'google'
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    } catch (err) {
                        console.warn('Erro ao inicializar GSI Google:', err);
                    }
                };
                document.head.appendChild(script);
            }
        }

        function setupGoogleAuthMessageListener() {
            if (isGoogleAuthListenerActive) return;
            isGoogleAuthListenerActive = true;

            window.addEventListener('message', (event) => {
                try {
                    // Validar se mensagem é de sucesso do OAuth Google
                    if (!event.data || event.data.type !== 'OAUTH_AUTH_SUCCESS' || event.data.provider !== 'google') {
                        return;
                    }
                    if (event.data.user) {
                        processGoogleCustomerAuth(event.data.user);
                    }
                } catch (err) {
                    console.error('Erro ao processar mensagem do popup Google:', err);
                }
            });
        }

        async function handleGoogleCustomerAuth(mode = 'login') {
            setupGoogleAuthMessageListener();

            try {
                // 1. Tentar verificar se o servidor possui Google OAuth URL ou client_id configurado
                let authUrlData = null;
                try {
                    const res = await fetch('/api/auth/google/url');
                    if (res.ok) {
                        authUrlData = await res.json();
                    }
                } catch (err) {
                    console.warn('API de autenticação Google indisponível, utilizando fluxo cliente/seletor:', err);
                }

                // Se houver clientId configurado, carregar GSI de forma limpa
                if (authUrlData && authUrlData.clientId) {
                    loadGoogleGsiScript(authUrlData.clientId);
                }

                // 2. Se o servidor tem OAuth configurado com Client Secret, abre popup oficial do Google
                if (authUrlData && authUrlData.configured && authUrlData.url) {
                    const authWindow = window.open(
                        authUrlData.url,
                        'google_oauth_popup',
                        'width=540,height=660,left=150,top=100'
                    );

                    if (authWindow) {
                        closeCustomerAuthModal();
                        showNotification('🔐 Conectando com sua conta Google...', 'info');
                        return;
                    }
                }

                // 3. Executar Sincronização Automática com Contas do Dispositivo / Navegador
                closeCustomerAuthModal();
                const syncResult = await triggerNativeGoogleSync(true, authUrlData?.clientId);

                if (syncResult && syncResult.success && syncResult.user) {
                    processGoogleCustomerAuth(syncResult.user);
                    return;
                }

                // 4. Se existem contas salvas / sincronizadas no dispositivo, abrir Seletor com alternância
                const savedAccounts = getSavedGoogleAccounts();
                if (savedAccounts.length > 0) {
                    openGoogleAccountPickerModal(mode);
                } else {
                    // Se ainda não há contas sincronizadas, abrir diretamente o formulário ágil e seguro de Adicionar Conta Google
                    openGoogleCustomAccountModal();
                }

            } catch (err) {
                console.error('Erro na autenticação Google:', err);
                openGoogleCustomAccountModal();
            }
        }

        function getSavedGoogleAccounts() {
            return customerAccounts.filter(acc => 
                acc.provider === 'google' || 
                (acc.email && acc.email.includes('@') && !acc.email.endsWith('@local'))
            );
        }

        async function triggerNativeGoogleSync(isSilent = false, clientId = null) {
            if (!isSilent) {
                showNotification('🔄 Sincronizando contas do seu celular ou navegador...', 'info');
            }

            // 1. Tentar via Credential Management API (se disponível no celular / navegador)
            if (navigator.credentials && navigator.credentials.get) {
                try {
                    const cred = await navigator.credentials.get({
                        password: true,
                        mediation: 'optional'
                    });
                    if (cred && cred.id && cred.id.includes('@')) {
                        const cleanEmail = cred.id.trim().toLowerCase();
                        const cleanName = cred.name || cleanEmail.split('@')[0];
                        return {
                            success: true,
                            user: {
                                email: cleanEmail,
                                name: cleanName,
                                googleId: 'google-' + btoa(cleanEmail).substring(0, 14),
                                provider: 'google'
                            }
                        };
                    }
                } catch (e) {
                    console.log('Credential API ignorada:', e);
                }
            }

            // 2. Tentar via Google Identity Services prompt (One Tap) APENAS se houver clientId válido
            if (clientId && window.google && window.google.accounts && window.google.accounts.id) {
                try {
                    window.google.accounts.id.prompt((notification) => {
                        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                            if (!isSilent) {
                                openGoogleCustomAccountModal();
                            }
                        }
                    });
                } catch (e) {
                    console.warn('Google prompt fallback:', e);
                }
            }

            if (!isSilent) {
                const saved = getSavedGoogleAccounts();
                if (saved.length > 0) {
                    openGoogleAccountPickerModal();
                    showNotification('✅ Contas sincronizadas com sucesso!', 'success');
                } else {
                    openGoogleCustomAccountModal();
                }
            }

            return { success: false };
        }

        function openGoogleAccountPickerModal(mode = 'login') {
            const modal = document.getElementById('googleAccountPickerModal');
            const container = document.getElementById('googleAccountsListContainer');
            const subtext = document.getElementById('googleSyncSubtext');
            if (!modal || !container) return;

            // Buscar contas sincronizadas / salvas no navegador para este dispositivo
            const savedGoogleAccounts = getSavedGoogleAccounts();

            if (savedGoogleAccounts.length > 0) {
                if (subtext) subtext.textContent = 'Selecione ou alterne a conta Google para este pedido:';
                let html = '';
                savedGoogleAccounts.forEach(acc => {
                    const accName = acc.name || (acc.email ? acc.email.split('@')[0] : 'Usuário Google');
                    const initial = accName.charAt(0).toUpperCase();
                    html += `
                        <button type="button" class="google-account-item" onclick="selectGoogleAccount('${escapeHtml(acc.email)}', '${escapeHtml(accName)}')">
                            <div class="google-avatar-circle">
                                ${initial}
                            </div>
                            <div style="flex: 1; overflow: hidden;">
                                <div style="font-weight: 700; color: #1E293B; font-size: 0.95rem; display: flex; align-items: center; gap: 0.35rem;">
                                    ${escapeHtml(accName)}
                                    <span style="background: #E0F2FE; color: #0284C7; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; font-weight: 700;">Conectada</span>
                                </div>
                                <div style="font-size: 0.82rem; color: #64748B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                    ${escapeHtml(acc.email)}
                                </div>
                            </div>
                            <span style="color: #94A3B8; font-size: 1.1rem;">➔</span>
                        </button>
                    `;
                });
                container.innerHTML = html;
            } else {
                if (subtext) subtext.textContent = 'Nenhuma conta encontrada ainda. Adicione uma conta Google:';
                container.innerHTML = `
                    <div style="text-align: center; padding: 1.25rem 0.5rem; background: #F8FAFC; border-radius: 12px; border: 1px dashed #CBD5E1; margin-bottom: 0.5rem;">
                        <div style="font-size: 2rem; margin-bottom: 0.4rem;">📱</div>
                        <div style="font-weight: 700; color: #334155; font-size: 0.9rem; margin-bottom: 0.25rem;">
                            Conectar Conta Google
                        </div>
                        <p style="font-size: 0.8rem; color: #64748B; margin: 0 0 0.85rem 0; line-height: 1.4;">
                            Identifique-se com sua conta Google para sincronizar seus pedidos automaticamente.
                        </p>
                        <button type="button" class="btn-admin" onclick="openGoogleCustomAccountModal()" style="background: #4285F4; color: white; border: none; padding: 0.6rem 1.2rem; font-size: 0.88rem; font-weight: 700; border-radius: 8px;">
                            ➕ Adicionar Conta Google
                        </button>
                    </div>
                `;
            }

            modal.classList.add('active');
        }

        function closeGoogleAccountPickerModal() {
            const modal = document.getElementById('googleAccountPickerModal');
            if (modal) modal.classList.remove('active');
        }

        function openGoogleCustomAccountModal(initialEmail = '') {
            closeCustomerAuthModal();
            closeGoogleAccountPickerModal();

            const modal = document.getElementById('googleCustomAccountModal');
            const emailInput = document.getElementById('googleCustomEmailInput');

            if (emailInput) emailInput.value = initialEmail;

            updateGoogleAccountPreview();

            if (modal) modal.classList.add('active');
            if (emailInput) {
                setTimeout(() => emailInput.focus(), 150);
            }
        }

        function closeGoogleCustomAccountModal() {
            const modal = document.getElementById('googleCustomAccountModal');
            if (modal) modal.classList.remove('active');
        }

        function backToGoogleAccountsPicker() {
            closeGoogleCustomAccountModal();
            const saved = getSavedGoogleAccounts();
            if (saved.length > 0) {
                openGoogleAccountPickerModal();
            } else {
                openCustomerAuthModal();
            }
        }

        function appendEmailDomain(domain) {
            const emailInput = document.getElementById('googleCustomEmailInput');
            if (!emailInput) return;
            let val = emailInput.value.trim();
            if (!val) {
                emailInput.value = domain;
            } else if (!val.includes('@')) {
                emailInput.value = val + domain;
            }
            updateGoogleAccountPreview();
            emailInput.focus();
        }

        function updateGoogleAccountPreview() {
            const emailInput = document.getElementById('googleCustomEmailInput');
            const previewAvatar = document.getElementById('googleCardPreviewAvatar');
            const previewName = document.getElementById('googleCardPreviewName');
            const previewEmail = document.getElementById('googleCardPreviewEmail');

            const emailVal = (emailInput ? emailInput.value : '').trim();

            let displayName = '';
            if (emailVal && emailVal.includes('@')) {
                const part = emailVal.split('@')[0].replace(/[._-]/g, ' ');
                displayName = part.split(' ').map(w => w ? w.charAt(0).toUpperCase() + w.slice(1) : '').join(' ').trim();
            }
            if (!displayName) displayName = 'Sua Conta Google';

            const displayEmail = emailVal || 'seu.email@gmail.com';
            const initial = displayName !== 'Sua Conta Google' ? displayName.charAt(0).toUpperCase() : 'G';

            if (previewAvatar) previewAvatar.textContent = initial;
            if (previewName) previewName.textContent = displayName;
            if (previewEmail) previewEmail.textContent = displayEmail;
        }

        function handleGoogleCustomAccountSubmit(event) {
            if (event) event.preventDefault();

            const emailInput = document.getElementById('googleCustomEmailInput');
            const emailVal = (emailInput ? emailInput.value : '').trim().toLowerCase();

            if (!emailVal || !emailVal.includes('@') || !emailVal.includes('.')) {
                showNotification('Por favor, informe um endereço de e-mail do Google válido.', 'warning');
                if (emailInput) emailInput.focus();
                return;
            }

            const rawName = emailVal.split('@')[0].replace(/[._-]/g, ' ');
            const formattedName = rawName.split(' ').map(w => w ? w.charAt(0).toUpperCase() + w.slice(1) : '').join(' ').trim() || 'Usuário Google';

            closeGoogleCustomAccountModal();
            selectGoogleAccount(emailVal, formattedName);
        }

        function selectGoogleAccount(email, name) {
            closeGoogleAccountPickerModal();
            closeGoogleCustomAccountModal();

            const cleanEmail = (email || '').trim().toLowerCase();
            const cleanName = (name || cleanEmail.split('@')[0] || 'Usuário Google').trim();

            const googleUser = {
                email: cleanEmail,
                name: cleanName,
                googleId: 'google-' + btoa(cleanEmail).substring(0, 14),
                provider: 'google'
            };

            processGoogleCustomerAuth(googleUser);
        }

        function handleGoogleCustomAccountPrompt() {
            openGoogleCustomAccountModal();
        }

        function processGoogleCustomerAuth(googleUser) {
            if (!googleUser || !googleUser.email) return;

            const cleanEmail = googleUser.email.trim().toLowerCase();
            const googleName = googleUser.name || cleanEmail.split('@')[0] || 'Cliente Google';

            // 1. Verificar se o cliente já possui conta cadastrada
            const existingAccount = customerAccounts.find(acc => 
                (acc.email && acc.email.toLowerCase() === cleanEmail) || 
                (acc.googleId && acc.googleId === googleUser.googleId) ||
                (acc.phone && acc.phone === cleanEmail)
            );

            if (existingAccount) {
                // Login automático imediato
                AuthManager.loginCustomer(existingAccount);
                customerData = {
                    name: existingAccount.name,
                    email: existingAccount.email || cleanEmail,
                    neighborhood: existingAccount.neighborhood || '',
                    neighborhoodId: existingAccount.neighborhoodId || '',
                    neighborhoodZone: existingAccount.neighborhoodZone || '',
                    address: existingAccount.address || '',
                    reference: existingAccount.reference || '',
                    phone: existingAccount.phone || ''
                };
                localStorage.setItem('customerData', JSON.stringify(customerData));

                closeCustomerAuthModal();
                closeGoogleAccountPickerModal();
                renderCustomerForm();
                updateCartUI();
                updateCustomerHeaderUI();
                updateCheckoutButton();
                showNotification(`🎉 Bem-vindo(a) de volta, ${existingAccount.name}! Login com Google realizado com sucesso.`, 'success');
                if (typeof fetchOrdersFromServer === 'function') {
                    fetchOrdersFromServer(true);
                }
                return;
            }

            // 2. Novo cadastro via Google: abrir confirmação rápida de endereço para entrega
            closeCustomerAuthModal();
            closeGoogleAccountPickerModal();
            openGoogleAddressModal({
                ...googleUser,
                name: googleName,
                email: cleanEmail
            });
        }

        function openGoogleAddressModal(googleUser) {
            const modal = document.getElementById('googleAddressModal');
            const welcomeText = document.getElementById('googleWelcomeUserText');
            const tempData = document.getElementById('googleAuthTempData');

            if (welcomeText) welcomeText.textContent = `Olá, ${googleUser.name}!`;
            if (tempData) tempData.value = JSON.stringify(googleUser);

            populateGoogleAuthNeighborhoods();
            if (modal) modal.classList.add('active');
        }

        function closeGoogleAddressModal() {
            const modal = document.getElementById('googleAddressModal');
            if (modal) modal.classList.remove('active');
        }

        function populateGoogleAuthNeighborhoods() {
            const selectEl = document.getElementById('googleAuthNeighborhood');
            if (!selectEl) return;

            const list = (settings.deliveryNeighborhoods && settings.deliveryNeighborhoods.length > 0) 
                         ? settings.deliveryNeighborhoods 
                         : DEFAULT_DELIVERY_NEIGHBORHOODS;
            const activeList = list.filter(n => n.active !== false);

            const centroItems = activeList.filter(n => n.zone === 'centro');
            const zonaSulItems = activeList.filter(n => n.zone === 'zona_sul');
            const zonaNorteItems = activeList.filter(n => n.zone === 'zona_norte');
            const outrosItems = activeList.filter(n => n.zone !== 'centro' && n.zone !== 'zona_sul' && n.zone !== 'zona_norte');

            const renderOptions = (items) => items.map(n => `<option value="${n.id}">${n.name}</option>`).join('');

            selectEl.innerHTML = `
                <option value="">Selecione seu Bairro *</option>
                ${centroItems.length > 0 ? `<optgroup label="🏙️ Centro">${renderOptions(centroItems)}</optgroup>` : ''}
                ${zonaSulItems.length > 0 ? `<optgroup label="🌊 Zona Sul">${renderOptions(zonaSulItems)}</optgroup>` : ''}
                ${zonaNorteItems.length > 0 ? `<optgroup label="🌳 Zona Norte">${renderOptions(zonaNorteItems)}</optgroup>` : ''}
                ${outrosItems.length > 0 ? `<optgroup label="➕ Outras Regiões">${renderOptions(outrosItems)}</optgroup>` : ''}
                <option value="other">Outro Bairro</option>
            `;
        }

        function handleGoogleAuthNeighborhoodChange(val) {
            const customWrap = document.getElementById('googleAuthCustomNeighborhoodWrapper');
            const customInput = document.getElementById('googleAuthCustomNeighborhood');
            if (customWrap) {
                if (val === 'other') {
                    customWrap.style.display = 'block';
                    if (customInput) {
                        customInput.required = true;
                        customInput.focus();
                    }
                } else {
                    customWrap.style.display = 'none';
                    if (customInput) {
                        customInput.required = false;
                        customInput.value = '';
                    }
                }
            }
        }

        function handleGoogleAddressSubmit(e) {
            if (e) e.preventDefault();
            const tempDataEl = document.getElementById('googleAuthTempData');
            if (!tempDataEl || !tempDataEl.value) {
                showNotification('Erro ao processar dados da conta Google.', 'danger');
                return;
            }

            let googleUser = {};
            try {
                googleUser = JSON.parse(tempDataEl.value);
            } catch (err) {
                googleUser = { name: 'Cliente Google', email: 'cliente@gmail.com' };
            }

            const nSelect = document.getElementById('googleAuthNeighborhood');
            const nId = nSelect ? nSelect.value : '';
            const address = document.getElementById('googleAuthAddress')?.value.trim() || '';
            const reference = document.getElementById('googleAuthReference')?.value.trim() || '';
            const phone = document.getElementById('googleAuthPhone')?.value.trim() || '';

            if (!nId) {
                showNotification('Por favor, selecione seu Bairro para entrega!', 'warning');
                if (nSelect) nSelect.focus();
                return;
            }

            const list = (settings.deliveryNeighborhoods && settings.deliveryNeighborhoods.length > 0) 
                         ? settings.deliveryNeighborhoods 
                         : DEFAULT_DELIVERY_NEIGHBORHOODS;

            let nName = '';
            let nZone = '';
            let nZoneName = '';

            if (nId === 'other') {
                const customName = document.getElementById('googleAuthCustomNeighborhood')?.value.trim();
                if (!customName) {
                    showNotification('Por favor, digite o nome do seu bairro!', 'warning');
                    document.getElementById('googleAuthCustomNeighborhood')?.focus();
                    return;
                }
                nName = customName;
                nZone = 'outra';
                nZoneName = 'Outra Região';
            } else if (nId) {
                const found = list.find(n => n.id === nId);
                if (found) {
                    nName = found.name;
                    nZone = found.zone;
                    nZoneName = found.zoneName || (found.zone === 'centro' ? 'Centro' : (found.zone === 'zona_sul' ? 'Zona Sul' : (found.zone === 'zona_norte' ? 'Zona Norte' : 'Outra Região')));
                }
            }

            const newAccount = {
                name: googleUser.name,
                email: googleUser.email,
                googleId: googleUser.googleId,
                neighborhoodId: nId,
                neighborhood: nName,
                neighborhoodZone: nZoneName || nZone,
                address,
                reference,
                phone: phone || googleUser.email,
                provider: 'google'
            };

            customerAccounts.push(newAccount);
            localStorage.setItem('customerAccounts', JSON.stringify(customerAccounts));

            AuthManager.loginCustomer(newAccount);
            customerData = {
                name: newAccount.name,
                email: newAccount.email,
                neighborhoodId: nId,
                neighborhood: nName,
                neighborhoodZone: nZoneName || nZone,
                address,
                reference,
                phone: newAccount.phone
            };
            localStorage.setItem('customerData', JSON.stringify(customerData));

            closeGoogleAddressModal();
            renderCustomerForm();
            updateCartUI();
            updateCustomerHeaderUI();
            updateCheckoutButton();
            showNotification(`✨ Conta Google cadastrada com sucesso! Bem-vindo(a), ${newAccount.name}!`, 'success');
        }

        // ========== LOGIN DE EMPRESA (RESTRITO AOS DADOS CADASTRADOS NO PAINEL DEV) ==========
        function handleUnifiedCompanyLogin(e) {
            if (e) e.preventDefault();
            const emailInput = document.getElementById('unifiedCompLoginEmail');
            const passwordInput = document.getElementById('unifiedCompLoginPassword');
            const errorEl = document.getElementById('unifiedCompLoginError');

            const enteredIdentifier = emailInput ? emailInput.value.trim() : '';
            const enteredPassword = passwordInput ? passwordInput.value.trim() : '';

            if (!enteredPassword) return;

            if (errorEl) errorEl.style.display = 'none';

            const cleanPhone = enteredIdentifier.replace(/\D/g, '');
            const lowerId = enteredIdentifier.toLowerCase();

            // Validação estrita contra empresas cadastradas no Painel Dev
            let matchedCompany = companies.find(c => {
                if (c.adminPassword !== enteredPassword) return false;
                const cEmail = (c.email || '').trim().toLowerCase();
                const cPhone = (c.phone || c.whatsapp || '').replace(/\D/g, '');
                const cSlug = (c.slug || '').trim().toLowerCase();

                if (cEmail && cEmail === lowerId) return true;
                if (cleanPhone.length >= 8 && cPhone && (cPhone === cleanPhone || cPhone.endsWith(cleanPhone) || cleanPhone.endsWith(cPhone))) {
                    return true;
                }
                if (cSlug && cSlug === lowerId) return true;
                return false;
            });

            // Se não encontrou por e-mail/telefone/slug exato, verificar pela senha da empresa cadastrada no Painel Dev
            if (!matchedCompany) {
                matchedCompany = companies.find(c => c.adminPassword === enteredPassword);
            }

            if (matchedCompany) {
                switchActiveCompany(matchedCompany.id);
                loginAdminSuccess(matchedCompany);
                closeCustomerAuthModal();
                if (emailInput) emailInput.value = '';
                if (passwordInput) passwordInput.value = '';
                openAdminPanel();
                showNotification(`🚀 Acesso concedido à loja ${matchedCompany.name}!`, 'success');
            } else {
                if (errorEl) {
                    errorEl.style.display = 'block';
                    errorEl.textContent = '❌ E-mail/telefone ou senha incorretos!';
                }
                if (passwordInput) {
                    passwordInput.value = '';
                    passwordInput.focus();
                }
            }
        }

        async function handleCustomerLogin(e) {
            e.preventDefault();
            const phone = document.getElementById('loginPhone').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            let token = null;
            // Sincronizar login com servidor seguro
            try {
                const r = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone, password })
                });
                const res = await r.json();
                if (res && res.success && res.token) {
                    token = res.token;
                }
            } catch (err) {
                // Modo offline / local
            }

            const account = customerAccounts.find(acc => acc.phone === phone && acc.password === password);

            if (account) {
                AuthManager.loginCustomer(account, token);
                customerData = {
                    name: account.name,
                    email: account.email || '',
                    neighborhood: account.neighborhood || '',
                    neighborhoodId: account.neighborhoodId || '',
                    neighborhoodZone: account.neighborhoodZone || '',
                    address: account.address,
                    reference: account.reference || '',
                    phone: account.phone
                };
                localStorage.setItem('customerData', JSON.stringify(customerData));

                closeCustomerAuthModal();
                renderCustomerForm();
                updateCartUI();
                updateCustomerHeaderUI();
                updateCheckoutButton();
                showNotification(`Bem-vindo(a) de volta, ${account.name}! 👋`, 'success');
                if (typeof fetchOrdersFromServer === 'function') {
                    fetchOrdersFromServer(true);
                }
            } else {
                showNotification('Telefone ou senha incorretos! Se não possui conta, faça seu cadastro na aba Cadastrar.', 'danger');
            }
        }

        async function handleCustomerRegister(e) {
            e.preventDefault();
            const name = document.getElementById('authRegisterName').value.trim();
            const nSelect = document.getElementById('authRegisterNeighborhood');
            const nId = nSelect ? nSelect.value : '';
            const address = document.getElementById('authRegisterAddress').value.trim();
            const reference = document.getElementById('authRegisterReference')?.value.trim() || '';
            const phone = document.getElementById('authRegisterPhone').value.trim();
            const password = document.getElementById('authRegisterPassword').value.trim();

            let nName = '';
            let nZone = '';
            let nZoneName = '';

            if (!nId) {
                showNotification('Por favor, selecione seu Bairro / Região de entrega!', 'warning');
                if (nSelect) nSelect.focus();
                return;
            }

            const list = (settings.deliveryNeighborhoods && settings.deliveryNeighborhoods.length > 0) 
                         ? settings.deliveryNeighborhoods 
                         : DEFAULT_DELIVERY_NEIGHBORHOODS;

            if (nId === 'other') {
                const customName = document.getElementById('authRegisterCustomNeighborhood')?.value.trim();
                if (!customName) {
                    showNotification('Por favor, digite o nome do seu bairro!', 'warning');
                    document.getElementById('authRegisterCustomNeighborhood')?.focus();
                    return;
                }
                nName = customName;
                nZone = 'outra';
                nZoneName = 'Outra Região';
            } else if (nId) {
                const found = list.find(n => n.id === nId);
                if (found) {
                    nName = found.name;
                    nZone = found.zone;
                    nZoneName = found.zoneName || (found.zone === 'centro' ? 'Centro' : (found.zone === 'zona_sul' ? 'Zona Sul' : (found.zone === 'zona_norte' ? 'Zona Norte' : 'Outra Região')));
                }
            }

            if (customerAccounts.some(acc => acc.phone === phone)) {
                showNotification('Já existe uma conta com este telefone. Faça login!', 'info');
                switchAuthTab('login');
                document.getElementById('loginPhone').value = phone;
                return;
            }

            const newAccount = { 
                name, 
                neighborhoodId: nId,
                neighborhood: nName,
                neighborhoodZone: nZoneName || nZone,
                address, 
                reference,
                phone, 
                password 
            };
            customerAccounts.push(newAccount);
            localStorage.setItem('customerAccounts', JSON.stringify(customerAccounts));

            let token = null;
            // Sincronizar cadastro com backend seguro
            try {
                const r = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name,
                        phone,
                        password,
                        address,
                        neighborhood: nName,
                        reference
                    })
                });
                const res = await r.json();
                if (res && res.success && res.token) {
                    token = res.token;
                }
            } catch (err) {}

            // Logar automaticamente com AuthManager
            AuthManager.loginCustomer(newAccount, token);
            customerData = { 
                name, 
                neighborhoodId: nId,
                neighborhood: nName,
                neighborhoodZone: nZoneName || nZone,
                address, 
                reference,
                phone 
            };
            localStorage.setItem('customerData', JSON.stringify(customerData));

            closeCustomerAuthModal();
            renderCustomerForm();
            updateCartUI();
            updateCustomerHeaderUI();
            updateCheckoutButton();
            showNotification(`Cadastro realizado com sucesso! Bem-vindo(a), ${name}! ✨`, 'success');
        }

        function logoutCustomer() {
            AuthManager.logoutCustomer();
            customerData = null;
            localStorage.removeItem('customerData');
            closeCustomerOrdersModal();
            renderCustomerForm(true);
            updateCartUI(false);
            updateCheckoutButton();
            showNotification('Você saiu da sua conta.', 'info');
        }

        // ========== ACOMPANHAMENTO DE PEDIDOS ==========
        async function openCustomerOrdersModal() {
            renderCustomerProfileCard();
            renderCustomerOrdersList();
            const modal = document.getElementById('customerOrdersModal');
            if (modal) modal.classList.add('active');

            // Sincronizar pedidos do cliente em tempo real com o servidor
            const phone = (loggedCustomer && loggedCustomer.phone) || (customerData && customerData.phone);
            const cleanPhone = phone ? String(phone).replace(/\D/g, '') : '';
            if (cleanPhone) {
                try {
                    const res = await fetch(`/api/orders?phone=${encodeURIComponent(cleanPhone)}`);
                    const json = await res.json();
                    if (json && json.success && Array.isArray(json.data)) {
                        json.data.forEach(srvOrder => {
                            const idx = customerOrders.findIndex(o => String(o.id) === String(srvOrder.id));
                            if (idx >= 0) {
                                customerOrders[idx] = { ...customerOrders[idx], ...srvOrder };
                            } else {
                                customerOrders.unshift(srvOrder);
                            }
                        });
                        saveData();
                        renderCustomerOrdersList();
                    }
                } catch(e) {}
            }
        }

        function closeCustomerOrdersModal() {
            const modal = document.getElementById('customerOrdersModal');
            if (modal) modal.classList.remove('active');
        }

        function renderCustomerProfileCard() {
            const container = document.getElementById('customerProfileCardContainer');
            if (!container) return;

            if (loggedCustomer) {
                const deliveryInfo = getActiveDeliveryInfo();
                const bName = loggedCustomer.neighborhood || deliveryInfo.neighborhoodName || '';
                const zName = loggedCustomer.neighborhoodZone || deliveryInfo.neighborhoodZoneName || '';

                container.innerHTML = `
                    <div class="customer-profile-card">
                        <div class="customer-profile-header">
                            <div class="customer-profile-name">👤 ${loggedCustomer.name}</div>
                            <button class="btn-edit-customer" onclick="logoutCustomer()" style="color: #DC2626; border-color: #FCA5A5;">🚪 Sair</button>
                        </div>
                        <div class="customer-profile-detail">
                            ${bName ? `🛵 <strong>Bairro de Entrega:</strong> ${bName} ${zName ? `<span style="font-size: 0.75rem; background: #E0E7FF; color: #3730A3; padding: 0.1rem 0.35rem; border-radius: 4px; font-weight: 700; margin-left: 4px;">${zName}</span>` : ''}<br>` : ''}
                            📍 <strong>Endereço de Entrega:</strong> ${loggedCustomer.address || 'Endereço salvo'}<br>
                            ${loggedCustomer.reference ? `🎯 <strong>Ponto de Referência:</strong> ${loggedCustomer.reference}<br>` : ''}
                            📱 <strong>Telefone:</strong> ${loggedCustomer.phone}
                        </div>
                    </div>
                `;
            } else if (customerData && customerData.name) {
                container.innerHTML = `
                    <div class="customer-profile-card">
                        <div class="customer-profile-header">
                            <div class="customer-profile-name">👤 ${customerData.name}</div>
                            <button class="btn-edit-customer" onclick="openCustomerAuthModal('login')" style="color: var(--primary); border-color: var(--primary);">🔑 Entrar / Criar Conta</button>
                        </div>
                        <div class="customer-profile-detail">
                            📍 <strong>Endereço de Entrega:</strong> ${customerData.address || 'Não informado'}<br>
                            📱 <strong>Telefone:</strong> ${customerData.phone || 'Sem telefone'}
                        </div>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                        <span style="font-size: 0.85rem; color: #475569;">Acompanhe o status dos seus pedidos em tempo real:</span>
                        <button class="btn-edit-customer" onclick="openCustomerAuthModal('login')" style="color: var(--primary); border-color: var(--primary); font-weight: 700;">🔑 Entrar na Minha Conta</button>
                    </div>
                `;
            }
        }

        // ========== RENDERIZAR LINHA DO TEMPO DO PEDIDO ==========
        function renderOrderTimeline(order) {
            if (order.status === 'CANCELLED') {
                return `
                    <div class="order-timeline-container" style="background: #FEF2F2; border-color: #FCA5A5;">
                        <div class="order-timeline-header" style="margin-bottom: 0;">
                            <span class="order-timeline-title" style="color: #991B1B;">
                                🚫 Pedido Cancelado
                            </span>
                            <span class="order-timeline-status-desc" style="color: #991B1B; border-color: #FCA5A5; background: #FFF5F5;">
                                Cancelado
                            </span>
                        </div>
                    </div>
                `;
            }

            const steps = [
                { key: 'RECEIVED', label: 'Recebido', icon: '📝', desc: 'Pedido recebido com sucesso!' },
                { key: 'PREPARING', label: 'Em Preparação', icon: '🥣', desc: 'Açaí sendo preparado com carinho!' },
                { key: 'DELIVERING', label: 'Saiu p/ Entrega', icon: '🛵', desc: 'O entregador está a caminho!' },
                { key: 'COMPLETED', label: 'Entregue', icon: '✅', desc: 'Pedido entregue com sucesso!' }
            ];

            const statusOrder = ['RECEIVED', 'PREPARING', 'DELIVERING', 'COMPLETED'];
            const currentIndex = statusOrder.indexOf(order.status);
            const activeIndex = currentIndex >= 0 ? currentIndex : 0;
            const progressRatio = activeIndex / (steps.length - 1);
            const currentStepObj = steps[activeIndex] || steps[0];

            return `
                <div class="order-timeline-container">
                    <div class="order-timeline-header">
                        <span class="order-timeline-title">
                            📍 Status em Tempo Real
                        </span>
                        <span class="order-timeline-status-desc">
                            ${currentStepObj.icon} ${currentStepObj.desc}
                        </span>
                    </div>
                    <div class="timeline-wrapper">
                        <div class="timeline-track-bg"></div>
                        <div class="timeline-track-fill" style="width: calc((100% - 3.6rem) * ${progressRatio});"></div>
                        <div class="timeline-steps-grid">
                            ${steps.map((step, idx) => {
                                let stateClass = '';
                                let iconContent = step.icon;
                                if (idx < activeIndex) {
                                    stateClass = 'completed';
                                    iconContent = '✓';
                                } else if (idx === activeIndex) {
                                    stateClass = activeIndex === steps.length - 1 ? 'completed active' : 'active';
                                    if (idx === steps.length - 1) iconContent = '✓';
                                }

                                return `
                                    <div class="timeline-step ${stateClass}">
                                        <div class="timeline-icon-box">
                                            ${iconContent}
                                        </div>
                                        <span class="timeline-label">${step.label}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        function renderCustomerOrdersList() {
            const container = document.getElementById('customerOrdersList');
            const countBadge = document.getElementById('orderCountBadge');
            if (!container) return;

            // Coletar todos os pedidos das empresas e armazenamentos locais
            let allCustomerOrders = [];
            
            // 1. Pedidos do histórico global do dispositivo
            try {
                const storedPlaced = JSON.parse(localStorage.getItem('all_placed_orders') || '[]');
                if (Array.isArray(storedPlaced)) {
                    DefensiveUtils.safeArray(storedPlaced).forEach(ord => {
                        if (ord && ord.id && !allCustomerOrders.some(o => String(o.id) === String(ord.id))) {
                            allCustomerOrders.push(ord);
                        }
                    });
                }
            } catch(e) {}

            // 2. Pedidos das empresas em memória
            const safeCompanies = DefensiveUtils.safeArray(companies);
            if (safeCompanies.length > 0) {
                safeCompanies.forEach(comp => {
                    if (!comp) return;
                    const compOrders = DefensiveUtils.safeArray(comp.orders);
                    compOrders.forEach(ord => {
                        if (!ord || !ord.id) return;
                        const idx = allCustomerOrders.findIndex(o => String(o.id) === String(ord.id));
                        if (idx >= 0) {
                            allCustomerOrders[idx] = { ...allCustomerOrders[idx], ...ord };
                        } else {
                            allCustomerOrders.push(ord);
                        }
                    });
                });
            }

            // 3. Pedidos ativos em customerOrders
            DefensiveUtils.safeArray(customerOrders).forEach(ord => {
                if (!ord || !ord.id) return;
                const idx = allCustomerOrders.findIndex(o => String(o.id) === String(ord.id));
                if (idx >= 0) {
                    allCustomerOrders[idx] = { ...allCustomerOrders[idx], ...ord };
                } else {
                    allCustomerOrders.push(ord);
                }
            });

            // Filtrar pedidos deste cliente pelo número de telefone (se logado ou cadastrado)
            const phone = (loggedCustomer && loggedCustomer.phone) || (customerData && customerData.phone);
            const cleanPhone = phone ? String(phone).replace(/\D/g, '') : '';
            const myOrders = allCustomerOrders.filter(o => {
                if (!o) return false;
                if (cleanPhone && o.customerPhone) {
                    const ordPhone = String(o.customerPhone).replace(/\D/g, '');
                    return ordPhone === cleanPhone || ordPhone.endsWith(cleanPhone) || cleanPhone.endsWith(ordPhone);
                }
                return true;
            });

            if (countBadge) countBadge.textContent = `${myOrders.length} Pedido(s)`;

            if (myOrders.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 2rem 1rem; color: var(--gray-600);">
                        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📦</div>
                        <p style="font-weight: 700; margin-bottom: 0.25rem;">Nenhum pedido realizado ainda.</p>
                        <small>Faça seu pedido e acompanhe o status de preparação e entrega em tempo real aqui!</small>
                    </div>
                `;
                return;
            }

            const statusLabels = {
                'RECEIVED': { text: '🟡 Pedido Recebido', class: 'status-received' },
                'PREPARING': { text: '🟣 Em Preparação', class: 'status-preparing' },
                'DELIVERING': { text: '🔵 Saiu para Entrega', class: 'status-delivering' },
                'COMPLETED': { text: '🟢 Entregue', class: 'status-completed' },
                'CANCELLED': { text: '🔴 Cancelado', class: 'status-cancelled' }
            };

            container.innerHTML = myOrders.map(order => {
                if (!order) return '';
                const st = statusLabels[order.status] || statusLabels['RECEIVED'];
                const targetStoreName = DefensiveUtils.escapeHtml(order.companyName || settings.restaurantName || 'Restaurante');
                const rawWa = order.companyWhatsapp || settings.whatsappNumber || '';
                const cleanWa = String(rawWa).replace(/\D/g, '');
                const encodedWa = encodeURIComponent(`Olá! Gostaria de acompanhar meu Pedido ${order.id} em ${order.companyName || settings.restaurantName}.`);
                const orderId = DefensiveUtils.escapeHtml(String(order.id || ''));
                const orderDate = DefensiveUtils.escapeHtml(order.date || 'Hoje');
                const totalFormatted = DefensiveUtils.formatCurrency(order.total || 0);

                const items = DefensiveUtils.safeArray(order.items);

                return `
                    <div class="order-card">
                        <div class="order-card-header">
                            <div>
                                <div style="font-size: 0.78rem; font-weight: 800; color: var(--primary); margin-bottom: 2px;">
                                    🏬 ${targetStoreName}
                                </div>
                                <div class="order-id">Pedido ${orderId}</div>
                                <div class="order-date">📅 ${orderDate}</div>
                            </div>
                            <span class="order-status-badge ${st.class}">${st.text}</span>
                        </div>
                        ${renderOrderTimeline(order)}
                        <div class="order-items-summary">
                            <strong>Itens Solicitados:</strong>
                            <ul style="margin-top: 4px; padding-left: 1.2rem; font-size: 0.85rem;">
                                ${items.map(i => {
                                    if (!i) return '';
                                    const qty = DefensiveUtils.safeNumber(i.quantity, 1);
                                    const itemName = DefensiveUtils.escapeHtml(i.name || 'Item');
                                    const details = i.details ? `<br><small style="color:#6B21A8; font-weight:600;">🥣 ${DefensiveUtils.escapeHtml(i.details)}</small>` : '';
                                    return `
                                    <li style="margin-bottom: 3px;">
                                        <strong>${qty}x ${itemName}</strong>
                                        ${details}
                                    </li>
                                `;
                                }).join('')}
                            </ul>
                        </div>
                        <div class="order-card-footer">
                            <span class="order-total-price">Total: ${totalFormatted}</span>
                            <a href="https://wa.me/${cleanWa}?text=${encodedWa}" target="_blank" class="btn-track-whatsapp">
                                💬 WhatsApp (${targetStoreName})
                            </a>
                        </div>
                        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.4rem; font-size: 0.78rem;">
                            <span style="background: #FAF5FF; color: #59176B; border: 1px solid #E9D5FF; padding: 0.2rem 0.5rem; border-radius: 6px; font-weight: 700;">💳 ${DefensiveUtils.escapeHtml(order.paymentMethod || 'Pix')}</span>
                            <span style="background: #FEF3C7; color: #92400E; border: 1px solid #FCD34D; padding: 0.2rem 0.5rem; border-radius: 6px; font-weight: 700;">⏱️ Previsão: ${DefensiveUtils.escapeHtml(order.deliveryTime || '30 - 45 min')}</span>
                            ${(order.couponCode || (order.discountValue && order.discountValue > 0) || (order.discount && order.discount > 0)) ? `<span style="background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; padding: 0.2rem 0.5rem; border-radius: 6px; font-weight: 700;">🏷️ Cupom: ${DefensiveUtils.escapeHtml(order.couponCode || 'PROMO')} (-${DefensiveUtils.formatCurrency(order.discountValue || order.discount || 0)})</span>` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        }

        // ========== GERENCIAR PEDIDOS NO ADMIN (ISOLADOS POR EMPRESA, BUSCA & ROLAGEM) ==========
        let adminOrderSearchQuery = '';
        let adminOrderFilterStatus = 'ALL';
        let expandedAdminOrders = new Set();

        const adminOrderStatusMap = {
            'RECEIVED': { text: 'Recebido', icon: '🟡', class: 'status-received', bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
            'PREPARING': { text: 'Em Preparo', icon: '🥣', class: 'status-preparing', bg: '#E0E7FF', color: '#3730A3', border: '#C7D2FE' },
            'DELIVERING': { text: 'Saiu p/ Entrega', icon: '🛵', class: 'status-delivering', bg: '#E0F2FE', color: '#075985', border: '#BAE6FD' },
            'COMPLETED': { text: 'Entregue', icon: '✅', class: 'status-completed', bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
            'CANCELLED': { text: 'Cancelado', icon: '🔴', class: 'status-cancelled', bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5' }
        };

        function handleAdminOrderSearch(value) {
            adminOrderSearchQuery = (value || '').trim();
            const clearBtn = document.getElementById('adminOrderClearSearchBtn');
            if (clearBtn) {
                clearBtn.style.display = adminOrderSearchQuery ? 'block' : 'none';
            }
            renderAdminOrdersList();
        }

        function clearAdminOrderSearch() {
            adminOrderSearchQuery = '';
            const input = document.getElementById('adminOrderSearchInput');
            const clearBtn = document.getElementById('adminOrderClearSearchBtn');
            if (input) input.value = '';
            if (clearBtn) clearBtn.style.display = 'none';
            renderAdminOrdersList();
        }

        function filterAdminOrdersByStatus(status) {
            adminOrderFilterStatus = status || 'ALL';
            
            // Atualizar classes ativas dos chips
            const chips = ['ALL', 'RECEIVED', 'PREPARING', 'DELIVERING', 'COMPLETED', 'CANCELLED'];
            chips.forEach(s => {
                const chipEl = document.getElementById(`chipStatus${s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}`);
                if (chipEl) {
                    if (s === adminOrderFilterStatus) {
                        chipEl.classList.add('active');
                    } else {
                        chipEl.classList.remove('active');
                    }
                }
            });

            renderAdminOrdersList();
        }

        function toggleAdminOrderExpand(orderId, event) {
            if (event) {
                // Prevenir clique em botões internos, selects ou links
                const tag = event.target.tagName.toLowerCase();
                if (tag === 'select' || tag === 'button' || tag === 'a' || tag === 'input' || event.target.closest('.no-toggle')) {
                    return;
                }
            }

            if (expandedAdminOrders.has(orderId)) {
                expandedAdminOrders.delete(orderId);
            } else {
                expandedAdminOrders.add(orderId);
            }
            renderAdminOrdersList();
        }

        function updateAdminOrderStatusCounts(companyOrdersList) {
            const counts = {
                ALL: companyOrdersList.length,
                RECEIVED: 0,
                PREPARING: 0,
                DELIVERING: 0,
                COMPLETED: 0,
                CANCELLED: 0
            };

            companyOrdersList.forEach(o => {
                const st = o.status || 'RECEIVED';
                if (counts[st] !== undefined) counts[st]++;
            });

            const countAllEl = document.getElementById('countStatusAll');
            const countRecEl = document.getElementById('countStatusReceived');
            const countPrepEl = document.getElementById('countStatusPreparing');
            const countDelEl = document.getElementById('countStatusDelivering');
            const countCompEl = document.getElementById('countStatusCompleted');
            const countCancEl = document.getElementById('countStatusCancelled');
            const badgeEl = document.getElementById('adminOrdersCounterBadge');

            if (countAllEl) countAllEl.textContent = counts.ALL;
            if (countRecEl) countRecEl.textContent = counts.RECEIVED;
            if (countPrepEl) countPrepEl.textContent = counts.PREPARING;
            if (countDelEl) countDelEl.textContent = counts.DELIVERING;
            if (countCompEl) countCompEl.textContent = counts.COMPLETED;
            if (countCancEl) countCancEl.textContent = counts.CANCELLED;
            if (badgeEl) badgeEl.textContent = `${counts.ALL} pedido(s)`;
        }

        function getActiveCompanyOrders() {
            const activeCompId = activeCompanyId || 'company-demo-don';
            let allCompanyOrders = [];

            // A. De customerOrders em memória
            DefensiveUtils.safeArray(customerOrders).forEach(ord => {
                if (!ord || !ord.id) return;
                const matchesComp = ord.companyId === activeCompId || (!ord.companyId && activeCompId === 'company-demo-don');
                if (matchesComp && !allCompanyOrders.some(o => String(o.id) === String(ord.id) || String(o.id).replace('#', '') === String(ord.id).replace('#', ''))) {
                    allCompanyOrders.push(ord);
                }
            });

            // B. De companies[activeCompId].orders
            const safeCompanies = DefensiveUtils.safeArray(companies);
            const activeCompObj = safeCompanies.find(c => c && c.id === activeCompId);
            if (activeCompObj && Array.isArray(activeCompObj.orders)) {
                DefensiveUtils.safeArray(activeCompObj.orders).forEach(ord => {
                    if (!ord || !ord.id) return;
                    const idx = allCompanyOrders.findIndex(o => String(o.id) === String(ord.id) || String(o.id).replace('#', '') === String(ord.id).replace('#', ''));
                    if (idx >= 0) {
                        allCompanyOrders[idx] = { ...allCompanyOrders[idx], ...ord };
                    } else {
                        allCompanyOrders.push(ord);
                    }
                });
            }

            // C. De localStorage ('customerOrders_' + activeCompId)
            try {
                const storedLocal = JSON.parse(localStorage.getItem(`customerOrders_${activeCompId}`) || '[]');
                if (Array.isArray(storedLocal)) {
                    DefensiveUtils.safeArray(storedLocal).forEach(ord => {
                        if (!ord || !ord.id) return;
                        const idx = allCompanyOrders.findIndex(o => String(o.id) === String(ord.id) || String(o.id).replace('#', '') === String(ord.id).replace('#', ''));
                        if (idx >= 0) {
                            allCompanyOrders[idx] = { ...allCompanyOrders[idx], ...ord };
                        } else {
                            allCompanyOrders.push(ord);
                        }
                    });
                }
            } catch(e) {}

            // D. De localStorage ('all_placed_orders')
            try {
                const storedAll = JSON.parse(localStorage.getItem('all_placed_orders') || '[]');
                if (Array.isArray(storedAll)) {
                    DefensiveUtils.safeArray(storedAll).forEach(ord => {
                        if (!ord || !ord.id) return;
                        const matchesComp = ord.companyId === activeCompId || (!ord.companyId && activeCompId === 'company-demo-don');
                        if (matchesComp) {
                            const idx = allCompanyOrders.findIndex(o => String(o.id) === String(ord.id) || String(o.id).replace('#', '') === String(ord.id).replace('#', ''));
                            if (idx >= 0) {
                                allCompanyOrders[idx] = { ...allCompanyOrders[idx], ...ord };
                            } else {
                                allCompanyOrders.push(ord);
                            }
                        }
                    });
                }
            } catch(e) {}

            return allCompanyOrders;
        }

        function renderAdminOrdersList() {
            const container = document.getElementById('adminOrdersList');
            if (!container) return;

            // Unificar todos os pedidos pertinentes a esta empresa de todas as fontes disponíveis
            const allCompanyOrders = getActiveCompanyOrders();

            // Sincronizar customerOrders com a lista unificada
            customerOrders = allCompanyOrders;
            const companyOrdersList = allCompanyOrders;

            // 2. Atualizar contadores de status
            updateAdminOrderStatusCounts(companyOrdersList);

            if (companyOrdersList.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 2rem 1rem; color: var(--gray-600); background: #FFFFFF; border-radius: 8px; border: 1px dashed #CBD5E1;">
                        <div style="font-size: 2.2rem; margin-bottom: 0.4rem;">📦</div>
                        <strong style="color: var(--gray-800); display: block; font-size: 0.95rem;">Nenhum pedido registrado ainda</strong>
                        <small style="color: var(--gray-500);">Os pedidos feitos pelos clientes aparecerão aqui automaticamente em tempo real.</small>
                    </div>
                `;
                return;
            }

            // 3. Aplicar Filtro de Status
            let filteredList = companyOrdersList;
            if (adminOrderFilterStatus !== 'ALL') {
                filteredList = filteredList.filter(o => (o.status || 'RECEIVED') === adminOrderFilterStatus);
            }

            // 4. Aplicar Filtro de Busca (Nome do Cliente, Número do Pedido, Telefone ou Itens)
            if (adminOrderSearchQuery) {
                const q = adminOrderSearchQuery.toLowerCase();
                filteredList = filteredList.filter(o => {
                    if (!o) return false;
                    const idMatch = (o.id || '').toLowerCase().includes(q);
                    const nameMatch = (o.customerName || '').toLowerCase().includes(q);
                    const phoneMatch = (o.customerPhone || '').toLowerCase().includes(q);
                    const addrMatch = (o.customerAddress || '').toLowerCase().includes(q);
                    const items = DefensiveUtils.safeArray(o.items);
                    const itemsMatch = items.some(i => i && (i.name || '').toLowerCase().includes(q));
                    return idMatch || nameMatch || phoneMatch || addrMatch || itemsMatch;
                });
            }

            if (filteredList.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 2rem 1rem; color: var(--gray-600); background: #FFFFFF; border-radius: 8px; border: 1px dashed #CBD5E1;">
                        <div style="font-size: 2rem; margin-bottom: 0.3rem;">🔍</div>
                        <strong style="color: var(--gray-800); display: block; font-size: 0.92rem;">Nenhum pedido encontrado</strong>
                        <small style="color: var(--gray-500);">Tente buscar por outro termo ou selecione outro filtro de status.</small>
                        <br>
                        <button type="button" onclick="clearAdminOrderSearch(); filterAdminOrdersByStatus('ALL');" class="btn-admin" style="margin-top: 0.75rem; background: #EEF2FF; color: #4338CA; border: 1px solid #C7D2FE; font-size: 0.78rem; padding: 0.35rem 0.8rem; border-radius: 6px;">
                            Limpar Filtros
                        </button>
                    </div>
                `;
                return;
            }

            container.innerHTML = filteredList.map(order => {
                if (!order) return '';
                const isExpanded = expandedAdminOrders.has(order.id);
                const st = adminOrderStatusMap[order.status] || adminOrderStatusMap['RECEIVED'];
                const items = DefensiveUtils.safeArray(order.items);
                const totalItemsCount = items.reduce((acc, i) => acc + DefensiveUtils.safeNumber(i?.quantity, 1), 0);
                const encodedWa = encodeURIComponent(`Olá ${order.customerName || 'Cliente'}! Aqui é da ${settings.restaurantName}, sobre seu pedido ${order.id}.`);
                const cleanPhone = (order.customerPhone || '').replace(/\D/g, '');
                const cleanTotal = DefensiveUtils.formatCurrency(order.total || 0);

                return `
                    <div class="admin-order-compact-card ${isExpanded ? 'expanded' : ''}" id="adminOrderCard_${order.id}">
                        <!-- BARRA RESUMO COMPACTA (CLIQUE PARA EXPANDIR/RECOLHER) -->
                        <div class="admin-order-summary-row" onclick="toggleAdminOrderExpand('${order.id}', event)" title="Clique para ${isExpanded ? 'recolher' : 'ver'} todos os detalhes deste pedido">
                            <!-- ESQUERDA: NÚMERO DO PEDIDO + NOME DO CLIENTE + DATA -->
                            <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; min-width: 220px; flex: 1;">
                                <span style="background: #312E81; color: #FFFFFF; font-weight: 800; font-size: 0.78rem; padding: 3px 8px; border-radius: 6px; font-family: monospace;">
                                    ${DefensiveUtils.escapeHtml(String(order.id || ''))}
                                </span>
                                <div>
                                    <div style="font-weight: 800; color: #1E1B4B; font-size: 0.92rem; display: flex; align-items: center; gap: 0.35rem;">
                                        👤 ${DefensiveUtils.escapeHtml(order.customerName || 'Cliente')}
                                        ${order.customerPhone ? `<span style="font-size: 0.75rem; color: #64748B; font-weight: normal;">(${DefensiveUtils.escapeHtml(order.customerPhone)})</span>` : ''}
                                    </div>
                                    <div style="font-size: 0.72rem; color: #64748B; margin-top: 1px;">
                                        📅 ${DefensiveUtils.escapeHtml(order.date || 'Hoje')} • 📦 <strong>${totalItemsCount} iten(s)</strong> • 💳 ${DefensiveUtils.escapeHtml(order.paymentMethod || 'Pix')}
                                    </div>
                                </div>
                            </div>

                            <!-- DIREITA: VALOR TOTAL + STATUS + AÇÕES RÁPIDAS + CHEVRON -->
                            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;" class="no-toggle">
                                <span style="font-size: 0.95rem; font-weight: 900; color: #047857; background: #ECFDF5; padding: 3px 8px; border-radius: 6px; border: 1px solid #A7F3D0;">
                                    ${cleanTotal}
                                </span>

                                <select class="admin-order-status-select no-toggle" onchange="updateOrderStatus('${order.id}', this.value)" style="font-size: 0.78rem; padding: 0.3rem 0.5rem; border-radius: 6px; font-weight: 700; background: ${st.bg}; color: ${st.color}; border: 1px solid ${st.border};" title="Alterar status do pedido">
                                    <option value="RECEIVED" ${order.status === 'RECEIVED' ? 'selected' : ''}>🟡 Recebido</option>
                                    <option value="PREPARING" ${order.status === 'PREPARING' ? 'selected' : ''}>🟣 Em Preparação</option>
                                    <option value="DELIVERING" ${order.status === 'DELIVERING' ? 'selected' : ''}>🔵 Saiu p/ Entrega</option>
                                    <option value="COMPLETED" ${order.status === 'COMPLETED' ? 'selected' : ''}>🟢 Entregue</option>
                                    <option value="CANCELLED" ${order.status === 'CANCELLED' ? 'selected' : ''}>🔴 Cancelado</option>
                                </select>

                                <button type="button" onclick="triggerPrintOrder('${order.id}')" class="btn-admin no-toggle" style="background: #4F46E5; color: white; padding: 0.3rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700;" title="Imprimir comanda térmica 58mm">
                                    🖨️ Imprimir
                                </button>

                                <button type="button" onclick="openAdminOrderDetailModal('${order.id}')" class="btn-admin no-toggle" style="background: #EEF2FF; color: #4338CA; border: 1px solid #C7D2FE; padding: 0.3rem 0.55rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700;" title="Abrir em Janela Modal">
                                    🔍 Ver
                                </button>

                                <span class="admin-order-chevron" style="margin-left: 2px;">▼</span>
                            </div>
                        </div>

                        <!-- PAINEL DE DETALHES EXPANDIDO -->
                        <div class="admin-order-detail-panel">
                            <!-- DADOS DE ENTREGA & CONTATO DO CLIENTE -->
                            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.75rem; margin-bottom: 0.75rem; font-size: 0.82rem; color: #334155; line-height: 1.45;">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.35rem;">
                                    <div>
                                        📍 <strong>Endereço de Entrega:</strong> ${DefensiveUtils.escapeHtml(order.customerAddress || 'Endereço não informado')}<br>
                                        ${order.customerReference ? `🎯 <strong style="color: #6D28D9;">Ponto de Referência:</strong> ${DefensiveUtils.escapeHtml(order.customerReference)}<br>` : ''}
                                        📱 <strong>Telefone:</strong> ${DefensiveUtils.escapeHtml(order.customerPhone || 'Sem telefone')} | 
                                        ⏱️ <strong style="color: #D97706;">Previsão:</strong> ${DefensiveUtils.escapeHtml(order.deliveryTime || '30 - 45 min')}
                                    </div>
                                    ${cleanPhone ? `
                                        <a href="https://wa.me/55${cleanPhone}?text=${encodedWa}" target="_blank" class="btn-admin" style="background: #25D366; color: white; font-size: 0.75rem; font-weight: 700; padding: 0.35rem 0.7rem; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 0.3rem;">
                                            💬 WhatsApp do Cliente
                                        </a>
                                    ` : ''}
                                </div>
                            </div>

                            <!-- LINHA DO TEMPO VISUAL DO STATUS -->
                            <div style="margin-bottom: 0.75rem;">
                                ${renderOrderTimeline(order)}
                            </div>

                            <!-- TABELA / LISTA DETALHADA DE ITENS -->
                            <div style="background: #FAF5FF; border: 1px solid #F3E8FF; border-radius: 8px; padding: 0.75rem; margin-bottom: 0.75rem;">
                                <div style="font-weight: 800; color: #59176B; font-size: 0.84rem; margin-bottom: 0.4rem; display: flex; justify-content: space-between;">
                                    <span>🥣 Itens do Pedido:</span>
                                    <span>${totalItemsCount} item(ns)</span>
                                </div>
                                <ul style="margin: 0; padding-left: 1.1rem; font-size: 0.84rem; color: #1E1B4B;">
                                    ${items.map(i => {
                                        if (!i) return '';
                                        const qty = DefensiveUtils.safeNumber(i.quantity, 1);
                                        const price = DefensiveUtils.safeNumber(i.price, 0);
                                        const itemName = DefensiveUtils.escapeHtml(i.name || 'Item');
                                        const details = i.details ? `<div style="font-size: 0.78rem; color: #6B21A8; margin-top: 1px; font-weight: 600;">🥣 ${DefensiveUtils.escapeHtml(i.details)}</div>` : '';
                                        return `
                                        <li style="margin-bottom: 0.4rem;">
                                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                                <span><strong>${qty}x ${itemName}</strong></span>
                                                ${price > 0 ? `<span style="font-weight: 700; color: #4338CA;">${DefensiveUtils.formatCurrency(price * qty)}</span>` : ''}
                                            </div>
                                            ${details}
                                        </li>
                                    `;
                                    }).join('')}
                                </ul>
                            </div>

                            <!-- RESUMO FINANCEIRO & BOTÕES DE AÇÃO -->
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.6rem; border-top: 1px dashed #E2E8F0; padding-top: 0.6rem;">
                                <div style="font-size: 0.84rem;">
                                    <div style="font-weight: 800; color: #1E1B4B; font-size: 0.95rem;">
                                        Total: <span style="color: #047857;">${cleanTotal}</span>
                                    </div>
                                    ${(order.couponCode || (order.discountValue && order.discountValue > 0) || (order.discount && order.discount > 0)) ? `
                                        <div style="font-size: 0.75rem; color: #059669; font-weight: 700; margin-top: 2px;">
                                            🏷️ Cupom Aplicado: ${DefensiveUtils.escapeHtml(order.couponCode || 'PROMO')} (-${DefensiveUtils.formatCurrency(order.discountValue || order.discount || 0)})
                                        </div>
                                    ` : ''}
                                    <div style="font-size: 0.75rem; color: #64748B; margin-top: 1px;">
                                        Forma de Pagamento: <strong>${DefensiveUtils.escapeHtml(order.paymentMethod || 'Pix')}</strong>
                                    </div>
                                </div>

                                <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
                                    <button type="button" onclick="triggerPrintOrder('${order.id}')" class="btn-print-order" style="padding: 0.45rem 0.85rem; font-size: 0.8rem;" title="Imprimir cupom de 58mm">
                                        🖨️ Imprimir Comanda (58mm)
                                    </button>
                                    <button type="button" onclick="openAdminOrderDetailModal('${order.id}')" class="btn-admin" style="background: #312E81; color: white; font-size: 0.8rem; padding: 0.45rem 0.8rem; border-radius: 6px;" title="Ver comprovante e modal">
                                        📋 Comprovante
                                    </button>
                                    <button type="button" onclick="deleteOrder('${order.id}')" style="background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; cursor: pointer; font-size: 0.8rem; padding: 0.45rem 0.75rem; border-radius: 6px; font-weight: 700;" title="Excluir pedido do histórico">
                                        🗑️ Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // ========== MODAL DE DETALHES DO PEDIDO (ADMIN) ==========
        function openAdminOrderDetailModal(orderId) {
            let order = customerOrders.find(o => String(o.id) === String(orderId) || String(o.id).replace('#', '') === String(orderId).replace('#', ''));
            if (!order) {
                for (const c of (companies || [])) {
                    if (c.orders) {
                        const found = c.orders.find(o => String(o.id) === String(orderId) || String(o.id).replace('#', '') === String(orderId).replace('#', ''));
                        if (found) { order = found; break; }
                    }
                }
            }
            if (!order) {
                try {
                    const allPlaced = JSON.parse(localStorage.getItem('all_placed_orders') || '[]');
                    order = allPlaced.find(o => String(o.id) === String(orderId) || String(o.id).replace('#', '') === String(orderId).replace('#', ''));
                } catch(e) {}
            }
            if (!order) return;

            const modal = document.getElementById('adminOrderDetailModal');
            const titleEl = document.getElementById('adminOrderDetailTitle');
            const dateEl = document.getElementById('adminOrderDetailDate');
            const bodyEl = document.getElementById('adminOrderDetailBody');

            if (!modal || !bodyEl) return;

            const st = adminOrderStatusMap[order.status] || adminOrderStatusMap['RECEIVED'];
            const totalItemsCount = (order.items || []).reduce((acc, i) => acc + (i.quantity || 1), 0);
            const encodedWa = encodeURIComponent(`Olá ${order.customerName}! Aqui é da ${settings.restaurantName}, sobre seu pedido ${order.id}.`);
            const cleanPhone = (order.customerPhone || '').replace(/\D/g, '');

            if (titleEl) titleEl.innerHTML = `📋 Pedido <strong>${order.id}</strong> — ${order.customerName}`;
            if (dateEl) dateEl.innerHTML = `Realizado em: ${order.date || 'Hoje'} • Loja: <strong>${order.companyName || settings.restaurantName}</strong>`;

            bodyEl.innerHTML = `
                <!-- STATUS DO PEDIDO & SELETOR -->
                <div style="background: ${st.bg}; border: 1px solid ${st.border}; border-radius: 10px; padding: 0.85rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                    <div>
                        <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: ${st.color};">Status Atual</div>
                        <div style="font-size: 1.05rem; font-weight: 900; color: ${st.color};">${st.icon} ${st.text}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.4rem;">
                        <span style="font-size: 0.8rem; font-weight: 700; color: ${st.color};">Mudar:</span>
                        <select onchange="updateOrderStatus('${order.id}', this.value); openAdminOrderDetailModal('${order.id}');" style="padding: 0.4rem 0.6rem; border-radius: 8px; font-weight: bold; font-size: 0.82rem; border: 1.5px solid ${st.color}; background: #FFFFFF; color: ${st.color};">
                            <option value="RECEIVED" ${order.status === 'RECEIVED' ? 'selected' : ''}>🟡 Recebido</option>
                            <option value="PREPARING" ${order.status === 'PREPARING' ? 'selected' : ''}>🟣 Em Preparação</option>
                            <option value="DELIVERING" ${order.status === 'DELIVERING' ? 'selected' : ''}>🔵 Saiu p/ Entrega</option>
                            <option value="COMPLETED" ${order.status === 'COMPLETED' ? 'selected' : ''}>🟢 Entregue</option>
                            <option value="CANCELLED" ${order.status === 'CANCELLED' ? 'selected' : ''}>🔴 Cancelado</option>
                        </select>
                    </div>
                </div>

                <!-- LINHA DO TEMPO -->
                <div style="margin-bottom: 1rem;">
                    ${renderOrderTimeline(order)}
                </div>

                <!-- DADOS DO CLIENTE & ENTREGA -->
                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 0.85rem; margin-bottom: 1rem; font-size: 0.85rem;">
                    <div style="font-weight: 800; color: #1E1B4B; margin-bottom: 0.4rem; font-size: 0.9rem;">
                        👤 Dados do Cliente & Entrega
                    </div>
                    <div><strong>Nome:</strong> ${order.customerName || 'Não informado'}</div>
                    <div><strong>Telefone:</strong> ${order.customerPhone || 'Não informado'}</div>
                    <div><strong>Endereço:</strong> ${order.customerAddress || 'Não informado'}</div>
                    ${order.customerReference ? `<div><strong style="color: #6D28D9;">Ponto de Referência:</strong> ${order.customerReference}</div>` : ''}
                    <div><strong>Previsão de Entrega:</strong> ${order.deliveryTime || '30 - 45 min'}</div>
                    <div><strong>Forma de Pagamento:</strong> ${order.paymentMethod || 'Pix'}</div>
                    ${cleanPhone ? `
                        <div style="margin-top: 0.6rem;">
                            <a href="https://wa.me/55${cleanPhone}?text=${encodedWa}" target="_blank" class="btn-admin" style="background: #25D366; color: white; font-size: 0.82rem; font-weight: 800; padding: 0.45rem 0.9rem; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;">
                                💬 Iniciar Conversa no WhatsApp
                            </a>
                        </div>
                    ` : ''}
                </div>

                <!-- ITENS DO PEDIDO -->
                <div style="background: #FAF5FF; border: 1px solid #E9D5FF; border-radius: 10px; padding: 0.85rem; margin-bottom: 1rem;">
                    <div style="font-weight: 800; color: #59176B; margin-bottom: 0.5rem; font-size: 0.9rem; display: flex; justify-content: space-between;">
                        <span>🥣 Itens do Pedido (${totalItemsCount} itens):</span>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        ${order.items.map(i => `
                            <div style="background: #FFFFFF; border: 1px solid #F3E8FF; border-radius: 8px; padding: 0.6rem 0.75rem;">
                                <div style="display: flex; justify-content: space-between; font-weight: 800; color: #1E1B4B; font-size: 0.88rem;">
                                    <span>${i.quantity}x ${i.name}</span>
                                    ${i.price ? `<span style="color: #4338CA;">R$ ${(i.price * (i.quantity || 1)).toFixed(2).replace('.', ',')}</span>` : ''}
                                </div>
                                ${i.details ? `<div style="font-size: 0.8rem; color: #6B21A8; margin-top: 3px; font-weight: 600;">🥣 ${i.details}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- TOTAIS & CUPOM -->
                <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 0.85rem; margin-bottom: 1.25rem;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.3rem;">
                        <span>Subtotal Itens:</span>
                        <strong>R$ ${(order.items || []).reduce((acc, i) => acc + ((i.price || 0) * (i.quantity || 1)), 0).toFixed(2).replace('.', ',')}</strong>
                    </div>
                    ${(order.couponCode || (order.discountValue && order.discountValue > 0) || (order.discount && order.discount > 0)) ? `
                        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #059669; font-weight: 700; margin-bottom: 0.3rem;">
                            <span>Desconto Cupom (${order.couponCode || 'PROMO'}):</span>
                            <span>-R$ ${(order.discountValue || order.discount || 0).toFixed(2).replace('.', ',')}</span>
                        </div>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 900; color: #1E1B4B; border-top: 1px solid #E2E8F0; padding-top: 0.5rem;">
                        <span>Total a Receber:</span>
                        <span style="color: #047857;">R$ ${order.total.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>

                <!-- AÇÕES DO MODAL -->
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end; flex-wrap: wrap;">
                    <button type="button" class="btn-admin" onclick="triggerPrintOrder('${order.id}')" style="background: #4F46E5; color: white; font-weight: 800; padding: 0.6rem 1.1rem; border-radius: 8px; display: flex; align-items: center; gap: 0.4rem;">
                        🖨️ Imprimir Térmica (58mm)
                    </button>
                    <button type="button" class="btn-admin" onclick="deleteOrder('${order.id}'); closeAdminOrderDetailModal();" style="background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; font-weight: 700; padding: 0.6rem 0.9rem; border-radius: 8px;">
                        🗑️ Excluir Pedido
                    </button>
                    <button type="button" class="btn-admin" onclick="closeAdminOrderDetailModal()" style="background: #E2E8F0; color: #334155; font-weight: 700; padding: 0.6rem 1rem; border-radius: 8px;">
                        Fechar
                    </button>
                </div>
            `;

            modal.classList.add('active');
        }

        function closeAdminOrderDetailModal() {
            const modal = document.getElementById('adminOrderDetailModal');
            if (modal) modal.classList.remove('active');
        }

        async function updateOrderStatus(orderId, newStatus) {
            let order = customerOrders.find(o => String(o.id) === String(orderId) || String(o.id).replace('#', '') === String(orderId).replace('#', ''));
            
            if (!order) {
                for (const c of companies) {
                    if (c.orders) {
                        const found = c.orders.find(o => String(o.id) === String(orderId) || String(o.id).replace('#', '') === String(orderId).replace('#', ''));
                        if (found) {
                            order = found;
                            customerOrders.push(order);
                            break;
                        }
                    }
                }
            }

            if (!order) {
                // Tentar carregar de all_placed_orders
                try {
                    const allPlaced = JSON.parse(localStorage.getItem('all_placed_orders') || '[]');
                    const found = allPlaced.find(o => String(o.id) === String(orderId) || String(o.id).replace('#', '') === String(orderId).replace('#', ''));
                    if (found) {
                        order = found;
                        customerOrders.push(order);
                    }
                } catch(e) {}
            }

            if (!order) return;

            order.status = newStatus;
            order.updated_at = new Date().toISOString();

            // Sincronizar em todas as empresas em memória
            companies.forEach(comp => {
                if (comp.orders) {
                    const compOrd = comp.orders.find(o => String(o.id) === String(order.id) || String(o.id).replace('#', '') === String(order.id).replace('#', ''));
                    if (compOrd) {
                        compOrd.status = newStatus;
                        compOrd.updated_at = order.updated_at;
                    }
                }
            });

            // Atualizar no storage global de pedidos
            try {
                let allPlaced = JSON.parse(localStorage.getItem('all_placed_orders') || '[]');
                const idx = allPlaced.findIndex(o => String(o.id) === String(order.id) || String(o.id).replace('#', '') === String(order.id).replace('#', ''));
                if (idx >= 0) {
                    allPlaced[idx].status = newStatus;
                    allPlaced[idx].updated_at = order.updated_at;
                } else {
                    allPlaced.unshift(order);
                }
                localStorage.setItem('all_placed_orders', JSON.stringify(allPlaced));
            } catch(e) {}

            saveData();
            renderCustomerOrdersList();
            renderAdminOrdersList();
            updateAdminHeaderUI();
            renderAdminOrdersDropdown();

            const stInfo = adminOrderStatusMap[newStatus] || { text: newStatus };
            showNotification(`Status do pedido ${order.id} alterado para "${stInfo.text}"! ✅`, 'success');

            // Sincronizar atualização de status com o servidor da empresa
            const targetCompanyId = order.companyId || activeCompanyId || 'company-demo-don';
            try {
                const res = await fetch(`/api/orders/${encodeURIComponent(order.id)}/status`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-company-id': targetCompanyId
                    },
                    body: JSON.stringify({ status: newStatus })
                });
                const json = await res.json();
                if (json && json.success && json.data) {
                    order.status = json.data.status;
                }
            } catch(err) {
                console.warn('Falha ao sincronizar status do pedido no servidor:', err.message);
            }
        }

        async function deleteOrder(orderId) {
            const confirmed = await showCustomConfirm({
                title: 'Excluir Pedido',
                message: `Deseja realmente excluir o pedido ${orderId} do histórico?`,
                icon: '📋',
                confirmText: 'Sim, Excluir',
                cancelText: 'Cancelar'
            });
            if (!confirmed) return;

            customerOrders = customerOrders.filter(o => String(o.id) !== String(orderId) && String(o.id).replace('#', '') !== String(orderId).replace('#', ''));
            if (knownOrderIds) {
                knownOrderIds.delete(orderId);
                knownOrderIds.delete(orderId.replace('#', ''));
            }

            companies.forEach(comp => {
                if (comp.orders) {
                    comp.orders = comp.orders.filter(o => String(o.id) !== String(orderId) && String(o.id).replace('#', '') !== String(orderId).replace('#', ''));
                }
            });

            try {
                let allPlaced = JSON.parse(localStorage.getItem('all_placed_orders') || '[]');
                allPlaced = allPlaced.filter(o => String(o.id) !== String(orderId) && String(o.id).replace('#', '') !== String(orderId).replace('#', ''));
                localStorage.setItem('all_placed_orders', JSON.stringify(allPlaced));
            } catch(e) {}

            saveData();
            renderCustomerOrdersList();
            renderAdminOrdersList();
            updateAdminHeaderUI();
            renderAdminOrdersDropdown();
            showNotification('Pedido removido do histórico.', 'info');

            // Sincronizar remoção com o servidor da empresa
            const targetCompanyId = activeCompanyId || 'company-demo-don';
            fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
                method: 'DELETE',
                headers: {
                    'x-company-id': targetCompanyId
                }
            }).catch(err => {
                console.warn('Falha ao excluir pedido no servidor:', err.message);
            });
        }

        // ========== IMPRESSORA TÉRMICA (MTI-773 / 58MM / BLUETOOTH / USB) ==========
        let bluetoothDevice = null;
        let printCharacteristic = null;
        let serialPort = null;
        let serialWriter = null;
        let printerSettings = {
            paperWidth: 58,
            autoPrint: true,
            fallbackSystemPrint: true
        };

        function openInNewTabForBluetooth() {
            const openLink = document.getElementById('btnOpenNewTab');
            if (openLink && openLink.href) {
                openLink.click();
            }
        }

        function checkBluetoothSupport() {
            const supportEl = document.getElementById('btSupportText');
            const openTabLink = document.getElementById('btnOpenNewTab');
            if (openTabLink) {
                openTabLink.href = window.location.href;
            }

            if (!supportEl) return;

            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const deviceType = isMobile ? 'Celular' : 'Computador / Notebook';
            const inIframe = window.self !== window.top;

            if (inIframe) {
                supportEl.innerHTML = `<span style="color: #6B21A8; font-weight: bold;">${deviceType} em Visualizador (use Impressão 58mm ou Abra em Nova Aba para USB/Bluetooth direto).</span>`;
            } else if (navigator.bluetooth || ('serial' in navigator)) {
                supportEl.innerHTML = `<span style="color: #059669; font-weight: bold;">${deviceType} com suporte a Conexão Direta (Bluetooth/USB) ativo!</span>`;
            } else {
                supportEl.innerHTML = `<span style="color: #D97706; font-weight: bold;">${deviceType} (Impressão Térmica do Sistema 58mm disponível).</span>`;
            }
        }

        function loadPrinterSettings() {
            const saved = localStorage.getItem('printerSettings');
            if (saved) {
                try { printerSettings = JSON.parse(saved); } catch(e){}
            }
            const widthSelect = document.getElementById('printerPaperWidth');
            const autoPrintCheck = document.getElementById('autoPrintOrders');
            const fallbackCheck = document.getElementById('fallbackSystemPrint');
            if (widthSelect) widthSelect.value = printerSettings.paperWidth || 58;
            if (autoPrintCheck) autoPrintCheck.checked = printerSettings.autoPrint !== false;
            if (fallbackCheck) fallbackCheck.checked = printerSettings.fallbackSystemPrint !== false;
            
            checkBluetoothSupport();
        }

        function savePrinterSettings() {
            const widthSelect = document.getElementById('printerPaperWidth');
            const autoPrintCheck = document.getElementById('autoPrintOrders');
            const fallbackCheck = document.getElementById('fallbackSystemPrint');
            if (widthSelect) printerSettings.paperWidth = parseInt(widthSelect.value) || 58;
            if (autoPrintCheck) printerSettings.autoPrint = autoPrintCheck.checked;
            if (fallbackCheck) printerSettings.fallbackSystemPrint = fallbackCheck.checked;
            localStorage.setItem('printerSettings', JSON.stringify(printerSettings));
            showNotification('Configurações da impressora salvas!', 'success');
        }

        function updatePrinterStatusUI(connected, deviceName = '', mode = 'Bluetooth') {
            const badge = document.getElementById('printerStatusBadge');
            const text = document.getElementById('printerStatusText');
            const btnDisconnect = document.getElementById('btnDisconnectPrinter');

            if (!badge || !text) return;

            if (connected) {
                badge.className = 'printer-status-box connected';
                text.innerHTML = `🟢 Conectada (${mode}): <strong>${deviceName || 'MTI-773 (58mm)'}</strong>`;
                if (btnDisconnect) btnDisconnect.style.display = 'block';
            } else {
                badge.className = 'printer-status-box disconnected';
                text.textContent = 'Nenhuma impressora conectada';
                if (btnDisconnect) btnDisconnect.style.display = 'none';
            }
        }

        async function connectUsbSerialPrinter() {
            if (!('serial' in navigator)) {
                showNotification('A conexão USB Web Serial é suportada no Google Chrome ou Microsoft Edge no Computador/Notebook.', 'info');
                return;
            }
            try {
                showNotification('Selecione a impressora USB conectada no seu computador...', 'info');
                serialPort = await navigator.serial.requestPort();
                await serialPort.open({ baudRate: 9600 });
                serialWriter = serialPort.writable.getWriter();
                updatePrinterStatusUI(true, 'Impressora MTI-773 (USB)', 'USB');
                showNotification('Impressora MTI-773 / 58mm conectada via Cabo USB com sucesso! 🖨️', 'success');
            } catch (err) {
                const isSecurityPolicy = err.name === 'SecurityError' || (err.message && err.message.toLowerCase().includes('permissions policy'));
                if (isSecurityPolicy) {
                    showNotification('O navegador restringe acesso USB direto dentro do visualizador incorporado (iframe). Abra em nova aba ou use a Impressão Normal do Sistema.', 'warning');
                } else if (err.name === 'NotFoundError' || err.name === 'AbortError') {
                    showNotification('Seleção de porta USB cancelada.', 'info');
                } else {
                    showNotification(`USB: ${err.message || 'Não foi possível conectar a porta serial.'}`, 'danger');
                }
            }
        }

        async function connectBluetoothPrinter() {
            if (!navigator.bluetooth) {
                showNotification('O seu navegador não possui a API Web Bluetooth habilitada. Use o Chrome no Android ou PC para conectar por Bluetooth, ou utilize a Impressão do Sistema.', 'info');
                return;
            }

            try {
                showNotification('Procurando impressoras Bluetooth (MTI-773 / POS-58)... Ligue e pareie a impressora!', 'info');

                const device = await navigator.bluetooth.requestDevice({
                    acceptAllDevices: true,
                    optionalServices: [
                        '000018f0-0000-1000-8000-00805f9b34fb',
                        '00001101-0000-1000-8000-00805f9b34fb',
                        '495353c2-fe7d-43e3-8fa7-775a47140854', // MTI-773 ISSC
                        'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
                        '0000e025-0000-1000-8000-00805f9b34fb'
                    ]
                });

                bluetoothDevice = device;
                device.addEventListener('gattserverdisconnected', onPrinterDisconnected);

                showNotification(`Conectando a ${device.name || 'MTI-773'}...`, 'info');
                const server = await device.gatt.connect();

                let foundChar = null;
                const services = await server.getPrimaryServices();
                for (const service of services) {
                    try {
                        const characteristics = await service.getCharacteristics();
                        for (const char of characteristics) {
                            if (char.properties.write || char.properties.writeWithoutResponse) {
                                foundChar = char;
                                break;
                            }
                        }
                    } catch (e) {
                        console.warn('Serviço sem características acessíveis:', e);
                    }
                    if (foundChar) break;
                }

                if (!foundChar) {
                    throw new Error('Não foi encontrada a porta de comunicação ESC/POS na impressora.');
                }

                printCharacteristic = foundChar;
                updatePrinterStatusUI(true, device.name || 'MTI-773 (58mm)', 'Bluetooth');
                showNotification(`Impressora ${device.name || 'MTI-773'} conectada com sucesso! 🖨️✨`, 'success');
            } catch (err) {
                const isSecurityPolicy = err.name === 'SecurityError' || (err.message && err.message.toLowerCase().includes('permissions policy'));
                if (isSecurityPolicy) {
                    showNotification('O navegador restringe Bluetooth em visualizadores incorporados (iframe). Abra em nova aba para conectar ou use a Impressão Normal do Sistema.', 'warning');
                } else if (err.name === 'NotFoundError' || err.name === 'AbortError') {
                    showNotification('Seleção de impressora Bluetooth cancelada.', 'info');
                } else {
                    showNotification(`Bluetooth: ${err.message || 'Verifique se a impressora MTI-773 está ligada.'}`, 'danger');
                }
            }
        }

        function disconnectPrinter() {
            if (bluetoothDevice && bluetoothDevice.gatt && bluetoothDevice.gatt.connected) {
                bluetoothDevice.gatt.disconnect();
            }
            if (serialWriter) {
                try { serialWriter.releaseLock(); } catch(e){}
                serialWriter = null;
            }
            if (serialPort) {
                try { serialPort.close(); } catch(e){}
                serialPort = null;
            }
            onPrinterDisconnected();
        }

        function disconnectBluetoothPrinter() {
            disconnectPrinter();
        }

        function onPrinterDisconnected() {
            bluetoothDevice = null;
            printCharacteristic = null;
            serialWriter = null;
            serialPort = null;
            updatePrinterStatusUI(false);
            showNotification('Impressora desconectada.', 'info');
        }

        async function sendToBluetoothPrinter(uint8array) {
            if (!printCharacteristic) throw new Error('Impressora não conectada via Bluetooth');
            const CHUNK_SIZE = 100;
            for (let i = 0; i < uint8array.length; i += CHUNK_SIZE) {
                const chunk = uint8array.slice(i, i + CHUNK_SIZE);
                if (printCharacteristic.properties.writeWithoutResponse) {
                    await printCharacteristic.writeValueWithoutResponse(chunk);
                } else {
                    await printCharacteristic.writeValue(chunk);
                }
                await new Promise(r => setTimeout(r, 50));
            }
        }

        function generateEscPosCommands(order) {
            const encoder = new TextEncoder();
            const cols = printerSettings.paperWidth === 80 ? 48 : 32;
            const line = '-'.repeat(cols) + '\n';
            const doubleLine = '='.repeat(cols) + '\n';

            const storeName = (settings.restaurantName || 'DON FOOD').toUpperCase();
            const storeAddress = (settings.address || '').trim();
            const storeCnpj = (settings.cnpj || '').trim();
            const storeInstagram = (settings.instagram || '').trim();

            let text = '';
            text += '\x1B\x40'; // Inicializar
            text += '\x1B\x61\x01'; // Centralizar
            text += '\x1D\x21\x11'; // Fonte dupla
            text += `${storeName}\n`;
            text += '\x1D\x21\x00'; // Normal
            if (storeCnpj) {
                text += `CNPJ: ${storeCnpj}\n`;
            }
            if (storeAddress) {
                text += `${storeAddress}\n`;
            }
            text += 'COMPROVANTE DE PEDIDO 58MM\n';
            text += doubleLine;

            text += '\x1B\x61\x00'; // Esquerda
            text += `PEDIDO  : ${order.id}\n`;
            text += `DATA    : ${order.date}\n`;
            text += `CLIENTE : ${order.customerName}\n`;
            text += `TEL     : ${order.customerPhone}\n`;
            if (order.customerNeighborhood) {
                text += `BAIRRO  : ${order.customerNeighborhood}${order.customerNeighborhoodZone ? ` (${order.customerNeighborhoodZone})` : ''}\n`;
            }
            text += `ENDERECO: ${order.customerAddress}\n`;
            if (order.customerReference) {
                text += `REF     : ${order.customerReference}\n`;
            }
            text += `PAGAMENTO: ${order.paymentMethod || 'Pix'}\n`;
            text += `PREVISAO : ${order.deliveryTime || '30 - 45 min'}\n`;
            text += line;

            text += 'ITENS SOLICITADOS:\n';
            order.items.forEach(item => {
                text += `${item.quantity}x ${item.name}\n`;
                if (item.details) {
                    text += `  > ${item.details}\n`;
                }
                const itemTotal = (item.price * item.quantity).toFixed(2).replace('.', ',');
                text += `  Valor: R$ ${itemTotal}\n`;
            });
            text += line;

            if (order.subtotal) text += `Subtotal : R$ ${order.subtotal.toFixed(2).replace('.', ',')}\n`;
            if (order.discountValue || order.discount) {
                const disc = order.discountValue || order.discount;
                text += `Desconto : -R$ ${disc.toFixed(2).replace('.', ',')} (${order.couponCode || 'Cupom'})\n`;
            }
            if (order.deliveryFee) text += `Taxa Ent : R$ ${order.deliveryFee.toFixed(2).replace('.', ',')}\n`;
            
            text += '\x1D\x21\x01';
            text += `TOTAL    : R$ ${order.total.toFixed(2).replace('.', ',')}\n`;
            text += '\x1D\x21\x00';
            text += doubleLine;

            text += '\x1B\x61\x01';
            text += 'Obrigado pela preferencia!\n';
            if (storeInstagram) {
                text += `${storeInstagram}\n`;
            }
            text += '\n\n\n\n';
            text += '\x1D\x56\x00';

            return encoder.encode(text);
        }

        function printOrderSystemThermal(order) {
            if (!order) return;

            const pWidthNum = printerSettings.paperWidth || 58;
            const pWidth = pWidthNum + 'mm';
            const storeName = (settings.restaurantName || 'DON FOOD').toUpperCase();
            const storeAddress = (settings.address || '').trim();
            const storeCnpj = (settings.cnpj || '').trim();
            const storeInstagram = (settings.instagram || '').trim();

            const items = order.items || [];
            const subtotalVal = typeof order.subtotal === 'number' ? order.subtotal : (parseFloat(order.subtotal) || 0);
            const discountVal = typeof order.discountValue === 'number' ? order.discountValue : (typeof order.discount === 'number' ? order.discount : (parseFloat(order.discountValue || order.discount) || 0));
            const deliveryFeeVal = typeof order.deliveryFee === 'number' ? order.deliveryFee : (parseFloat(order.deliveryFee) || 0);
            const totalVal = typeof order.total === 'number' ? order.total : (parseFloat(order.total) || 0);

            const receiptContentHtml = `
                <div class="thermal-ticket" style="font-family: 'Courier New', Courier, monospace; font-size: 11px; width: 100%; max-width: ${pWidth}; margin: 0 auto; text-align: center; color: #000000; line-height: 1.25; padding: 4px; box-sizing: border-box; background: #FFFFFF;">
                    <div style="font-size: 14px; font-weight: bold; text-transform: uppercase;">${storeName}</div>
                    ${storeCnpj ? `<div style="font-size: 9.5px; margin-top: 1px; color: #000;">CNPJ: ${storeCnpj}</div>` : ''}
                    ${storeAddress ? `<div style="font-size: 9.5px; margin-top: 1px; color: #000;">${storeAddress}</div>` : ''}
                    <div style="font-size: 10px; margin: 3px 0; font-weight: bold;">COMPROVANTE DE PEDIDO (${pWidth})</div>
                    <div style="border-top: 1px dashed #000; margin: 3px 0;"></div>
                    
                    <div style="text-align: left; margin: 4px 0; font-size: 10.5px; line-height: 1.35;">
                        <div><strong>PEDIDO:</strong> ${order.id || '#0000'}</div>
                        <div><strong>DATA:</strong> ${order.date || new Date().toLocaleString('pt-BR')}</div>
                        <div><strong>CLIENTE:</strong> ${order.customerName || 'Cliente'}</div>
                        <div><strong>TEL:</strong> ${order.customerPhone || '-'}</div>
                        ${order.customerNeighborhood ? `<div><strong>BAIRRO:</strong> ${order.customerNeighborhood}${order.customerNeighborhoodZone ? ` (${order.customerNeighborhoodZone})` : ''}</div>` : ''}
                        <div><strong>ENDEREÇO:</strong> ${order.customerAddress || '-'}</div>
                        ${order.customerReference ? `<div><strong>REF:</strong> ${order.customerReference}</div>` : ''}
                        <div><strong>PAGAMENTO:</strong> ${order.paymentMethod || 'Pix'}</div>
                        <div><strong>PREVISÃO:</strong> ${order.deliveryTime || '30 - 45 min'}</div>
                    </div>
                    
                    <div style="border-top: 1px dashed #000; margin: 3px 0;"></div>
                    <div style="text-align: left; font-weight: bold; margin: 3px 0; font-size: 11px;">ITENS SOLICITADOS:</div>
                    <div style="text-align: left; margin-bottom: 4px;">
                        ${items.map(item => {
                            const itemPrice = typeof item.price === 'number' ? item.price : (parseFloat(item.price) || 0);
                            const itemTotal = (itemPrice * (item.quantity || 1)).toFixed(2).replace('.', ',');
                            return `
                                <div style="margin-top: 3px; font-size: 10.5px;">
                                    <strong>${item.quantity || 1}x ${item.name}</strong> - R$ ${itemTotal}
                                    ${item.details ? `<div style="font-size: 9.5px; padding-left: 6px; color: #111;">> ${item.details}</div>` : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                    
                    <div style="border-top: 1px dashed #000; margin: 3px 0;"></div>
                    <div style="text-align: right; margin-top: 4px; font-size: 11px; line-height: 1.35;">
                        ${subtotalVal > 0 ? `<div>Subtotal: R$ ${subtotalVal.toFixed(2).replace('.', ',')}</div>` : ''}
                        ${discountVal > 0 ? `<div style="font-weight: bold;">Desconto (${order.couponCode || 'Cupom'}): -R$ ${discountVal.toFixed(2).replace('.', ',')}</div>` : ''}
                        <div>Taxa Entrega: R$ ${deliveryFeeVal.toFixed(2).replace('.', ',')}</div>
                        <div style="font-weight: bold; font-size: 13px; margin-top: 3px; border-top: 1px solid #000; padding-top: 2px;">TOTAL: R$ ${totalVal.toFixed(2).replace('.', ',')}</div>
                    </div>
                    
                    <div style="border-top: 1px dashed #000; margin: 4px 0 2px 0;"></div>
                    <div style="margin-top: 4px; font-size: 9.5px; text-align: center;">
                        Obrigado pela preferência!<br>
                        ${storeInstagram ? `<span>${storeInstagram}</span>` : ''}
                    </div>
                </div>
            `;

            // 1. Atualizar div #thermalPrintArea na página principal (garante que window.print funcione)
            let area = document.getElementById('thermalPrintArea');
            if (!area) {
                area = document.createElement('div');
                area.id = 'thermalPrintArea';
                document.body.appendChild(area);
            }
            area.innerHTML = receiptContentHtml;

            // 2. Tentar imprimir via Iframe isolado (elimina interferência de estilos do app e páginas em branco)
            try {
                let iframe = document.getElementById('thermalPrintIframe');
                if (iframe) {
                    iframe.remove();
                }
                iframe = document.createElement('iframe');
                iframe.id = 'thermalPrintIframe';
                iframe.setAttribute('style', 'position: fixed; top: -9999px; left: -9999px; width: 300px; height: 300px; border: 0; visibility: hidden;');
                document.body.appendChild(iframe);

                const iframeDoc = iframe.contentWindow || iframe.contentDocument;
                const doc = iframe.contentDocument || iframe.contentWindow.document;

                doc.open();
                doc.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <title>Comprovante - ${order.id || 'Pedido'}</title>
                        <style>
                            @page {
                                size: ${pWidth} auto;
                                margin: 0;
                            }
                            * {
                                box-sizing: border-box;
                                margin: 0;
                                padding: 0;
                            }
                            html, body {
                                width: 100%;
                                max-width: ${pWidth};
                                margin: 0 auto;
                                padding: 0;
                                background: #FFFFFF;
                                color: #000000;
                                font-family: 'Courier New', Courier, monospace;
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                        </style>
                    </head>
                    <body>
                        ${receiptContentHtml}
                    </body>
                    </html>
                `);
                doc.close();

                setTimeout(() => {
                    try {
                        iframe.contentWindow.focus();
                        iframe.contentWindow.print();
                    } catch (e) {
                        console.warn('Iframe print error, falling back to window.print:', e);
                        window.print();
                    }
                }, 250);
            } catch (err) {
                console.warn('Erro ao criar iframe de impressão, fallback para window.print:', err);
                window.print();
            }
        }

        async function triggerPrintOrder(orderId) {
            let order = null;
            if (typeof orderId === 'object') {
                order = orderId;
            } else {
                order = customerOrders.find(o => String(o.id) === String(orderId) || String(o.id).replace('#', '') === String(orderId).replace('#', ''));
                if (!order) {
                    for (const c of (companies || [])) {
                        if (c.orders) {
                            const found = c.orders.find(o => String(o.id) === String(orderId) || String(o.id).replace('#', '') === String(orderId).replace('#', ''));
                            if (found) { order = found; break; }
                        }
                    }
                }
                if (!order) {
                    try {
                        const allPlaced = JSON.parse(localStorage.getItem('all_placed_orders') || '[]');
                        order = allPlaced.find(o => String(o.id) === String(orderId) || String(o.id).replace('#', '') === String(orderId).replace('#', ''));
                    } catch(e) {}
                }
            }
            if (!order) return;

            let printedDirect = false;

            // 1. Tentar Bluetooth
            if (bluetoothDevice && bluetoothDevice.gatt && bluetoothDevice.gatt.connected && printCharacteristic) {
                try {
                    showNotification(`Enviando pedido ${order.id} para MTI-773 via Bluetooth... 🖨️`, 'info');
                    const cmdData = generateEscPosCommands(order);
                    await sendToBluetoothPrinter(cmdData);
                    showNotification(`Comprovante do Pedido ${order.id} impresso na MTI-773! 🖨️✨`, 'success');
                    printedDirect = true;
                } catch (e) {
                    console.error('Erro ao imprimir Bluetooth:', e);
                    showNotification('Falha ao enviar por Bluetooth. Tentando outro método...', 'info');
                }
            }

            // 2. Tentar USB Serial (se conectado)
            if (!printedDirect && serialWriter) {
                try {
                    showNotification(`Enviando pedido ${order.id} para MTI-773 via USB... 🖨️`, 'info');
                    const cmdData = generateEscPosCommands(order);
                    await serialWriter.write(cmdData);
                    showNotification(`Comprovante do Pedido ${order.id} impresso via USB! 🖨️✨`, 'success');
                    printedDirect = true;
                } catch (e) {
                    console.error('Erro ao imprimir USB:', e);
                    showNotification('Falha ao enviar por USB.', 'info');
                }
            }

            // 3. Fallback: Impressão do Sistema
            if (!printedDirect) {
                if (printerSettings.fallbackSystemPrint !== false) {
                    printOrderSystemThermal(order);
                } else {
                    showNotification('Conecte a impressora MTI-773 por Bluetooth ou USB para imprimir.', 'info');
                }
            }
        }

        async function testPrint58mm() {
            const testOrder = {
                id: '#TESTE',
                date: new Date().toLocaleString('pt-BR'),
                customerName: 'Cliente Teste MTI-773',
                customerPhone: '21999999999',
                customerAddress: 'Rua Principal, 100 - Centro',
                items: [
                    { quantity: 1, name: 'Super Barca de Açaí 58mm', details: 'Morango, Leite Ninho, Nutella', price: 34.99 }
                ],
                subtotal: 34.99,
                deliveryFee: 5.00,
                total: 39.99
            };

            await triggerPrintOrder(testOrder);
        }

        // ========== FORMULÁRIO DO CLIENTE & ENTREGA POR BAIRRO ==========
        function renderCustomerForm(force = false) {
            if (!customerFormContainer) return;
            const list = (settings.deliveryNeighborhoods && settings.deliveryNeighborhoods.length > 0) 
                         ? settings.deliveryNeighborhoods 
                         : DEFAULT_DELIVERY_NEIGHBORHOODS;
            const activeList = list.filter(n => n.active !== false);

            if (customerData) {
                const deliveryInfo = getActiveDeliveryInfo();
                const bName = customerData.neighborhood || deliveryInfo.neighborhoodName || 'Centro';
                const zName = customerData.neighborhoodZone || deliveryInfo.neighborhoodZoneName || 'RJ';

                // Mostrar dados salvos
                customerFormContainer.innerHTML = `
                    <div class="saved-customer" style="border: 1px solid var(--primary-light, #E9D5FF); background: #FAF5FF; border-radius: 8px; padding: 0.75rem;">
                        <div class="saved-customer-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                            <div class="saved-customer-title" style="font-weight: 800; font-size: 0.85rem; color: var(--primary-dark, #59176B);">
                                ✅ Endereço de Entrega Selecionado
                            </div>
                            <button type="button" class="btn-edit-customer" onclick="editCustomerData()" style="font-size: 0.75rem; color: var(--primary); background: white; border: 1px solid var(--primary); padding: 0.2rem 0.6rem; border-radius: 4px; cursor: pointer; font-weight: 700;">Editar</button>
                        </div>
                        <div class="saved-customer-info" style="font-size: 0.83rem; line-height: 1.4; color: var(--gray-800);">
                            <strong>👤 ${customerData.name}</strong><br>
                            🛵 <strong>Bairro:</strong> ${bName} <span style="font-size: 0.75rem; background: #E0E7FF; color: #3730A3; padding: 0.1rem 0.35rem; border-radius: 4px; font-weight: 700;">${zName}</span><br>
                            📍 <strong>Endereço:</strong> ${customerData.address}<br>
                            ${customerData.reference ? `🎯 <strong>Ponto de Ref.:</strong> ${customerData.reference}<br>` : ''}
                            📱 <strong>Telefone:</strong> ${customerData.phone}<br>
                            <div style="margin-top: 0.4rem; padding-top: 0.35rem; border-top: 1px dashed #CBD5E1; font-size: 0.78rem; color: #047857; font-weight: 700;">
                                🛵 Frete: R$ ${deliveryInfo.fee.toFixed(2).replace('.', ',')} | ⏱️ Previsão: ${deliveryInfo.time}
                            </div>
                        </div>
                    </div>
                `;
            } else {
                // Se o formulário já existir no DOM e não forçado, não recriar para manter valores e seleção do usuário
                if (!force && document.getElementById('customerDataForm')) {
                    return;
                }

                // Prefill inicial com cliente logado se houver
                const initialName = loggedCustomer ? (loggedCustomer.name || '') : '';
                const initialAddress = loggedCustomer ? (loggedCustomer.address || '') : '';
                const initialRef = loggedCustomer ? (loggedCustomer.reference || '') : '';
                const initialPhone = loggedCustomer ? (loggedCustomer.phone || '') : '';
                const initialNeighborhoodId = loggedCustomer ? (loggedCustomer.neighborhoodId || '') : '';

                // Montar opções agrupadas por região
                const centroItems = activeList.filter(n => n.zone === 'centro');
                const zonaSulItems = activeList.filter(n => n.zone === 'zona_sul');
                const zonaNorteItems = activeList.filter(n => n.zone === 'zona_norte');
                const outrosItems = activeList.filter(n => n.zone !== 'centro' && n.zone !== 'zona_sul' && n.zone !== 'zona_norte');

                const renderOptions = (items) => items.map(n => {
                    const feeStr = typeof n.fee === 'number' ? n.fee.toFixed(2).replace('.', ',') : parseFloat(n.fee || 0).toFixed(2).replace('.', ',');
                    const isSelected = initialNeighborhoodId && (initialNeighborhoodId === n.id || initialNeighborhoodId === n.name) ? 'selected' : '';
                    return `<option value="${n.id}" ${isSelected}>${n.name} (R$ ${feeStr} • ${n.time || '30-45 min'})</option>`;
                }).join('');

                // Mostrar formulário
                customerFormContainer.innerHTML = `
                    <div class="customer-form">
                        <div class="customer-form-title" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <span style="font-weight: 800; font-size: 0.88rem; color: var(--gray-800);">📋 Dados para Entrega</span>
                            <button type="button" onclick="openCustomerAuthModal('login')" style="background: none; border: none; color: var(--primary); font-weight: 700; font-size: 0.75rem; cursor: pointer;">🔑 Entrar/Cadastrar</button>
                        </div>
                        <form id="customerDataForm" onsubmit="saveCustomerData(event)">
                            <div style="margin-bottom: 0.45rem;">
                                <input 
                                    type="text" 
                                    class="form-input-small" 
                                    id="customerName" 
                                    placeholder="Nome completo *" 
                                    value="${initialName ? initialName.replace(/"/g, '&quot;') : ''}"
                                    required
                                >
                            </div>

                            <div style="margin-bottom: 0.45rem;">
                                <select 
                                    id="customerNeighborhood" 
                                    class="form-input-small" 
                                    required 
                                    onchange="handleCustomerNeighborhoodChange(this.value)"
                                    style="font-weight: 600; color: #1E293B;"
                                >
                                    <option value="">🛵 Selecione seu Bairro / Região *</option>
                                    ${centroItems.length > 0 ? `<optgroup label="🏙️ Centro">${renderOptions(centroItems)}</optgroup>` : ''}
                                    ${zonaSulItems.length > 0 ? `<optgroup label="🌊 Zona Sul">${renderOptions(zonaSulItems)}</optgroup>` : ''}
                                    ${zonaNorteItems.length > 0 ? `<optgroup label="🌳 Zona Norte">${renderOptions(zonaNorteItems)}</optgroup>` : ''}
                                    ${outrosItems.length > 0 ? `<optgroup label="➕ Outras Regiões">${renderOptions(outrosItems)}</optgroup>` : ''}
                                    <option value="other">➕ Outro Bairro (Taxa Base: R$ ${(settings.deliveryFee || 5).toFixed(2).replace('.', ',')})</option>
                                </select>
                                <div id="customerCustomNeighborhoodWrapper" style="display: none; margin-top: 0.35rem;">
                                    <input 
                                        type="text" 
                                        class="form-input-small" 
                                        id="customerCustomNeighborhood" 
                                        placeholder="Digite o nome do seu bairro *" 
                                        style="border-color: var(--primary);"
                                    >
                                </div>
                                <div id="customerNeighborhoodBadge" style="display: none; font-size: 0.76rem; color: #047857; background: #ECFDF5; padding: 0.25rem 0.5rem; border-radius: 6px; margin-top: 0.25rem; border: 1px solid #A7F3D0;"></div>
                            </div>

                            <div style="margin-bottom: 0.45rem;">
                                <input 
                                    type="text" 
                                    class="form-input-small" 
                                    id="customerAddress" 
                                    placeholder="Rua, Número e Complemento *" 
                                    value="${initialAddress ? initialAddress.replace(/"/g, '&quot;') : ''}"
                                    required
                                >
                            </div>

                            <div style="margin-bottom: 0.45rem;">
                                <input 
                                    type="text" 
                                    class="form-input-small" 
                                    id="customerReference" 
                                    placeholder="Ponto de Referência (ex: próx. ao mercado, portão branco)" 
                                    value="${initialRef ? initialRef.replace(/"/g, '&quot;') : ''}"
                                >
                            </div>

                            <div style="margin-bottom: 0.45rem;">
                                <input 
                                    type="tel" 
                                    class="form-input-small" 
                                    id="customerPhone" 
                                    placeholder="WhatsApp / Telefone (ex: 21999999999) *" 
                                    value="${initialPhone ? initialPhone.replace(/"/g, '&quot;') : ''}"
                                    required
                                >
                            </div>

                            <button type="submit" class="btn-admin btn-success" style="width: 100%; font-weight: 800; font-size: 0.85rem; padding: 0.5rem;">
                                💾 Confirmar Endereço & Calcular Frete
                            </button>
                        </form>
                    </div>
                `;

                if (initialNeighborhoodId) {
                    const sel = document.getElementById('customerNeighborhood');
                    if (sel && sel.value) {
                        handleCustomerNeighborhoodChange(sel.value);
                    }
                }
            }
        }

        function saveCustomerData(event) {
            if (event && event.preventDefault) {
                event.preventDefault();
            }
            
            const nameInput = document.getElementById('customerName');
            const addressInput = document.getElementById('customerAddress');
            const phoneInput = document.getElementById('customerPhone');
            const refInput = document.getElementById('customerReference');
            const nSelect = document.getElementById('customerNeighborhood');

            const nameVal = nameInput ? nameInput.value.trim() : '';
            const addressVal = addressInput ? addressInput.value.trim() : '';
            const phoneVal = phoneInput ? phoneInput.value.trim() : '';
            const refValue = refInput ? refInput.value.trim() : '';

            if (!nameVal) {
                showNotification('Por favor, digite seu nome completo!', 'warning');
                nameInput?.focus();
                return false;
            }

            const nId = nSelect ? nSelect.value : null;
            if (!nId) {
                showNotification('Por favor, selecione seu bairro / região de entrega!', 'warning');
                nSelect?.focus();
                return false;
            }

            let nName = '';
            let nZone = '';
            let nZoneName = '';

            const list = (settings.deliveryNeighborhoods && settings.deliveryNeighborhoods.length > 0) 
                         ? settings.deliveryNeighborhoods 
                         : DEFAULT_DELIVERY_NEIGHBORHOODS;

            if (nId === 'other') {
                const customName = document.getElementById('customerCustomNeighborhood')?.value.trim();
                if (!customName) {
                    showNotification('Por favor, digite o nome do seu bairro!', 'warning');
                    document.getElementById('customerCustomNeighborhood')?.focus();
                    return false;
                }
                nName = customName;
                nZone = 'outra';
                nZoneName = 'Outra Região';
            } else if (nId) {
                const found = list.find(n => n.id === nId);
                if (found) {
                    nName = found.name;
                    nZone = found.zone;
                    nZoneName = found.zoneName || (found.zone === 'centro' ? 'Centro' : (found.zone === 'zona_sul' ? 'Zona Sul' : (found.zone === 'zona_norte' ? 'Zona Norte' : 'Outra Região')));
                }
            }

            if (!addressVal) {
                showNotification('Por favor, informe seu endereço completo!', 'warning');
                addressInput?.focus();
                return false;
            }

            if (!phoneVal) {
                showNotification('Por favor, informe seu WhatsApp ou telefone!', 'warning');
                phoneInput?.focus();
                return false;
            }
            
            customerData = {
                name: nameVal,
                neighborhoodId: nId,
                neighborhood: nName,
                neighborhoodZone: nZoneName || nZone,
                address: addressVal,
                reference: refValue,
                phone: phoneVal
            };
            
            localStorage.setItem('customerData', JSON.stringify(customerData));
            
            // Criar ou atualizar conta automaticamente se não existir
            if (!loggedCustomer) {
                const existing = customerAccounts.find(a => a.phone === customerData.phone);
                if (existing) {
                    loggedCustomer = existing;
                    loggedCustomer.name = customerData.name;
                    loggedCustomer.neighborhood = nName;
                    loggedCustomer.neighborhoodId = nId;
                    loggedCustomer.neighborhoodZone = nZoneName;
                    loggedCustomer.address = customerData.address;
                    loggedCustomer.reference = refValue;
                } else {
                    loggedCustomer = {
                        name: customerData.name,
                        neighborhood: nName,
                        neighborhoodId: nId,
                        neighborhoodZone: nZoneName,
                        address: customerData.address,
                        reference: refValue,
                        phone: customerData.phone,
                        password: '123'
                    };
                    customerAccounts.push(loggedCustomer);
                }
                localStorage.setItem('customerAccounts', JSON.stringify(customerAccounts));
                localStorage.setItem('loggedCustomer', JSON.stringify(loggedCustomer));
                updateCustomerHeaderUI();
            } else {
                loggedCustomer.name = customerData.name;
                loggedCustomer.neighborhood = nName;
                loggedCustomer.neighborhoodId = nId;
                loggedCustomer.neighborhoodZone = nZoneName;
                loggedCustomer.address = customerData.address;
                loggedCustomer.reference = refValue;
                localStorage.setItem('loggedCustomer', JSON.stringify(loggedCustomer));
            }

            renderCustomerForm();
            updateCartUI();
            updateCheckoutButton();
            
            showNotification('Dados de entrega e frete calculados com sucesso!', 'success');
            return false;
        }

        function editCustomerData() {
            customerData = null;
            localStorage.removeItem('customerData');
            renderCustomerForm(true);
            updateCartUI(false);
            updateCheckoutButton();
        }

        function updateCheckoutButton() {
            const hasCustomerData = customerData !== null;
            btnCheckout.disabled = !hasCustomerData;
            
            if (!hasCustomerData) {
                btnCheckout.innerHTML = '📋 Confirme o endereço acima';
                btnCheckout.style.background = 'var(--gray-300)';
            } else {
                btnCheckout.innerHTML = '💬 Finalizar no WhatsApp';
                btnCheckout.style.background = 'var(--whatsapp)';
            }
        }

        function checkout() {
            const safeCart = DefensiveUtils.safeArray(cart);
            if (safeCart.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }

            if (!customerData) {
                alert('Por favor, preencha seus dados de entrega!');
                return;
            }

            const deliveryInfo = getActiveDeliveryInfo();
            const paymentMethodLabel = getFormattedPaymentMethod();
            const activeComp = (companies && companies.find(c => c.id === activeCompanyId)) || settings;
            const availableCoupons = DefensiveUtils.safeArray(settings.coupons || defaultCoupons);

            // 1. Construir objeto do Pedido de forma pura e validada
            const newOrder = OrderMessageBuilder.buildOrderRecord({
                cart: safeCart,
                customerData,
                paymentMethodLabel,
                appliedCoupon,
                company: activeComp,
                settings,
                deliveryInfo,
                availableCoupons
            });

            const currentCompId = newOrder.companyId;

            // 2. Armazenar no histórico local defensivamente
            if (!Array.isArray(customerOrders)) customerOrders = [];
            customerOrders.unshift(newOrder);
            if (knownOrderIds) knownOrderIds.add(newOrder.id);

            const activeCompObj = companies.find(c => c.id === currentCompId);
            if (activeCompObj) {
                if (!Array.isArray(activeCompObj.orders)) activeCompObj.orders = [];
                activeCompObj.orders.unshift(newOrder);
            }

            try {
                let allPlaced = JSON.parse(localStorage.getItem('all_placed_orders') || '[]');
                if (!Array.isArray(allPlaced)) allPlaced = [];
                allPlaced.unshift(newOrder);
                localStorage.setItem('all_placed_orders', JSON.stringify(allPlaced));
            } catch(e) {}

            saveData();

            // 3. Enviar pedido para a API central da empresa
            fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-company-id': currentCompId
                },
                body: JSON.stringify(newOrder)
            }).then(r => r.json()).then(res => {
                if (res && res.success) {
                    console.log('✅ Pedido salvo no servidor central:', res.data ? res.data.id : newOrder.id);
                }
            }).catch(err => {
                console.warn('ℹ️ Pedido registrado localmente:', err.message);
            });

            // 4. Garantir que a conta do cliente esteja registrada
            if (!loggedCustomer) {
                loggedCustomer = {
                    name: customerData.name,
                    neighborhood: customerData.neighborhood,
                    neighborhoodZone: customerData.neighborhoodZone,
                    address: customerData.address,
                    reference: customerData.reference || '',
                    phone: customerData.phone,
                    password: '123'
                };
                if (!Array.isArray(customerAccounts)) customerAccounts = [];
                if (!customerAccounts.some(a => a.phone === loggedCustomer.phone)) {
                    customerAccounts.push(loggedCustomer);
                    localStorage.setItem('customerAccounts', JSON.stringify(customerAccounts));
                }
                localStorage.setItem('loggedCustomer', JSON.stringify(loggedCustomer));
                updateCustomerHeaderUI();
            }

            // 5. Formatar mensagem pura para WhatsApp
            const message = OrderMessageBuilder.formatWhatsAppMessage({
                order: newOrder,
                restaurantName: settings.restaurantName || activeComp.name || 'Don Food'
            });

            const targetWaNumber = DefensiveUtils.sanitizePhone(activeComp.whatsappNumber || settings.whatsappNumber || '5511999999999');
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${targetWaNumber}?text=${encodedMessage}`;

            // Abrir WhatsApp
            window.open(whatsappURL, '_blank');

            // Limpar carrinho e cupom
            cart = [];
            appliedCoupon = null;
            if (activeCompanyId) localStorage.removeItem(`appliedCoupon_${activeCompanyId}`);
            saveData();
            updateCartUI();
            closeCart();

            renderAdminOrdersList();
            renderCustomerOrdersList();

            showNotification(`Pedido ${newOrder.id} enviado para o WhatsApp! Acompanhe o status na Área do Cliente. 📦`, 'success');

            // Abrir modal da Área do Cliente para acompanhamento do status em tempo real
            setTimeout(() => {
                openCustomerOrdersModal();
            }, 600);
        }

        // ========== EVENTOS ==========
        function attachEventListeners() {
            // Evento no rodapé para o clique secreto do Desenvolvedor (3 cliques no logo/texto do rodapé)
            const footerDevTrigger = document.getElementById('footerDevTrigger');
            if (footerDevTrigger) {
                footerDevTrigger.addEventListener('click', handleDevLogoClick);
            }

            // Formulário de Senha do Desenvolvedor
            const devPasswordForm = document.getElementById('devPasswordForm');
            if (devPasswordForm) {
                devPasswordForm.addEventListener('submit', handleDevPasswordSubmit);
            }

            // Formulário de Criação de Empresa pelo Desenvolvedor
            const devCreateForm = document.getElementById('devCreateForm');
            if (devCreateForm) {
                devCreateForm.addEventListener('submit', handleDevCreateCompany);
            }

            // Atalho de teclado para abrir login admin (Ctrl+Shift+A)
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                    e.preventDefault();
                    openAdminLogin();
                }
            });

            // Fechar dropdown de pedidos ativos ao clicar fora
            document.addEventListener('click', (e) => {
                const wrapper = document.getElementById('adminBellDropdownWrapper');
                if (wrapper && !wrapper.contains(e.target)) {
                    closeAdminOrdersDropdown();
                }
            });
            
            // Admin Panel FAB (se existir)
            const fab = document.getElementById('adminFab');
            if (fab) {
                fab.addEventListener('click', () => {
                    openAdminLogin();
                });
            }
            
            // Password Form (Painel de Login da Empresa com E-mail/Telefone e Senha - RBAC COMPANY_OWNER)
            passwordForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const emailInput = document.getElementById('companyLoginEmail');
                const enteredIdentifier = emailInput ? emailInput.value.trim() : '';
                const enteredPassword = passwordInput.value ? passwordInput.value.trim() : '';

                if (!enteredPassword) return;

                // Tentar autenticação segura no backend primeiro
                try {
                    const response = await fetch('/api/auth/company-login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            identifier: enteredIdentifier,
                            email: enteredIdentifier,
                            phone: enteredIdentifier,
                            password: enteredPassword,
                            companyId: activeCompanyId
                        })
                    });
                    const res = await response.json();

                    if (res && res.success && res.company) {
                        const matched = companies.find(c => c.id === res.company.id) || res.company;
                        switchActiveCompany(res.company.id);
                        loginAdminSuccess(matched, res.token);
                        if (emailInput) emailInput.value = '';
                        passwordInput.value = '';
                        if (passwordError) passwordError.style.display = 'none';
                        return;
                    }
                } catch (netErr) {
                    // Fallback para modo offline/local
                }

                // 1. Procurar empresa cadastrada que corresponda ao e-mail ou telefone e à senha
                const cleanPhone = enteredIdentifier.replace(/\D/g, '');
                const lowerId = enteredIdentifier.toLowerCase();
                let matchedCompany = companies.find(c => {
                    if (c.adminPassword !== enteredPassword) return false;
                    const cEmail = (c.email || '').trim().toLowerCase();
                    const cPhone = (c.phone || c.whatsapp || '').replace(/\D/g, '');

                    if (cEmail && cEmail === lowerId) return true;
                    if (cleanPhone.length >= 8 && cPhone && (cPhone === cleanPhone || cPhone.endsWith(cleanPhone) || cleanPhone.endsWith(cPhone))) {
                        return true;
                    }
                    if (!cEmail && (lowerId.includes('fb') || lowerId.includes('admin') || c.id === activeCompanyId)) {
                        return true;
                    }
                    return false;
                });

                // 2. Se não achou por e-mail/telefone exato, verificar se a senha confere com qualquer empresa
                if (!matchedCompany) {
                    matchedCompany = companies.find(c => c.adminPassword === enteredPassword);
                    if (matchedCompany && enteredIdentifier) {
                        if (enteredIdentifier.includes('@')) {
                            matchedCompany.email = enteredIdentifier;
                        } else if (cleanPhone.length >= 8) {
                            matchedCompany.phone = enteredIdentifier;
                        }
                        saveData();
                    }
                }

                if (matchedCompany) {
                    switchActiveCompany(matchedCompany.id);
                    loginAdminSuccess(matchedCompany);
                    if (emailInput) emailInput.value = '';
                    passwordInput.value = '';
                    if (passwordError) passwordError.style.display = 'none';
                } else {
                    if (passwordError) {
                        passwordError.style.display = 'block';
                        passwordError.textContent = '❌ E-mail/telefone ou senha incorretos! Por favor, verifique os dados cadastrados.';
                    }
                    passwordInput.value = '';
                    passwordInput.focus();
                }
            });
            
            passwordCancel.addEventListener('click', () => {
                passwordModal.classList.remove('active');
                if (passwordInput) passwordInput.value = '';
                const emailInput = document.getElementById('companyLoginEmail');
                if (emailInput) emailInput.value = '';
                if (passwordError) passwordError.style.display = 'none';
            });

            // Dedicated Login Form (/login - Tela Completa com Hero de Boas-Vindas à Loja Cadastrada)
            const dedicatedForm = document.getElementById('dedicatedLoginForm');
            if (dedicatedForm) {
                dedicatedForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const emailInput = document.getElementById('dedicatedLoginEmail');
                    const passwordEl = document.getElementById('dedicatedLoginPassword');
                    const errorEl = document.getElementById('dedicatedLoginError');
                    const btnSubmit = document.getElementById('btnDedicatedLoginSubmit');

                    const enteredIdentifier = emailInput ? emailInput.value.trim() : '';
                    const enteredPassword = passwordEl ? passwordEl.value.trim() : '';

                    if (!enteredPassword) return;

                    if (btnSubmit) {
                        btnSubmit.disabled = true;
                        btnSubmit.innerHTML = '⏳ Entrando no Painel...';
                    }
                    if (errorEl) errorEl.style.display = 'none';

                    // 1. Tentar autenticação no backend (/api/auth/company-login)
                    try {
                        const response = await fetch('/api/auth/company-login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                identifier: enteredIdentifier,
                                email: enteredIdentifier,
                                phone: enteredIdentifier,
                                password: enteredPassword,
                                companyId: activeCompanyId
                            })
                        });
                        const res = await response.json();

                        if (res && res.success && res.company) {
                            const matched = companies.find(c => c.id === res.company.id) || res.company;
                            switchActiveCompany(res.company.id);
                            loginAdminSuccess(matched, res.token);
                            if (passwordEl) passwordEl.value = '';
                            if (btnSubmit) {
                                btnSubmit.disabled = false;
                                btnSubmit.innerHTML = '🚀 Entrar no Painel da Loja';
                            }
                            switchToStoreView('login-success');
                            openAdminPanel();
                            return;
                        }
                    } catch (netErr) {
                        // Fallback defensivo offline
                    }

                    // 2. Procurar empresa cadastrada que corresponda ao e-mail ou telefone e à senha
                    const cleanPhone = enteredIdentifier.replace(/\D/g, '');
                    const lowerId = enteredIdentifier.toLowerCase();
                    let matchedCompany = companies.find(c => {
                        if (c.adminPassword !== enteredPassword) return false;
                        const cEmail = (c.email || '').trim().toLowerCase();
                        const cPhone = (c.phone || c.whatsapp || '').replace(/\D/g, '');

                        if (cEmail && cEmail === lowerId) return true;
                        if (cleanPhone.length >= 8 && cPhone && (cPhone === cleanPhone || cPhone.endsWith(cleanPhone) || cleanPhone.endsWith(cPhone))) {
                            return true;
                        }
                        if (!cEmail && (lowerId.includes('fb') || lowerId.includes('admin') || c.id === activeCompanyId)) {
                            return true;
                        }
                        return false;
                    });

                    // 3. Fallback: Se a senha bater com qualquer loja cadastrada
                    if (!matchedCompany) {
                        matchedCompany = companies.find(c => c.adminPassword === enteredPassword);
                        if (matchedCompany && enteredIdentifier) {
                            if (enteredIdentifier.includes('@')) {
                                matchedCompany.email = enteredIdentifier;
                            } else if (cleanPhone.length >= 8) {
                                matchedCompany.phone = enteredIdentifier;
                            }
                            saveData();
                        }
                    }

                    if (btnSubmit) {
                        btnSubmit.disabled = false;
                        btnSubmit.innerHTML = '🚀 Entrar no Painel da Loja';
                    }

                    if (matchedCompany) {
                        switchActiveCompany(matchedCompany.id);
                        loginAdminSuccess(matchedCompany);
                        if (passwordEl) passwordEl.value = '';
                        if (errorEl) errorEl.style.display = 'none';
                        switchToStoreView('login-success');
                        openAdminPanel();
                    } else {
                        if (errorEl) {
                            errorEl.style.display = 'block';
                            errorEl.textContent = '❌ E-mail/telefone ou senha incorretos! Por favor, verifique os dados cadastrados.';
                        }
                        if (passwordEl) {
                            passwordEl.value = '';
                            passwordEl.focus();
                        }
                    }
                });
            }

            // Suporte ao formulário de login direto na Loja Demo (/login)
            const demoForm = document.getElementById('demoLoginForm');
            if (demoForm) {
                demoForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const demoEmail = document.getElementById('demoLoginEmail');
                    const demoPass = document.getElementById('demoLoginPassword');
                    const demoError = document.getElementById('demoLoginError');
                    const demoBtn = document.getElementById('btnDemoLoginSubmit');
                    const dedicatedEmail = document.getElementById('dedicatedLoginEmail');
                    const dedicatedPass = document.getElementById('dedicatedLoginPassword');
                    const dedicatedError = document.getElementById('dedicatedLoginError');

                    if (dedicatedEmail && demoEmail) dedicatedEmail.value = demoEmail.value;
                    if (dedicatedPass && demoPass) dedicatedPass.value = demoPass.value;

                    if (demoBtn) {
                        demoBtn.disabled = true;
                        demoBtn.innerHTML = '⏳ Entrando no Painel...';
                    }
                    if (demoError) demoError.style.display = 'none';

                    if (dedicatedForm) {
                        dedicatedForm.dispatchEvent(new Event('submit', { cancelable: true }));
                    }

                    setTimeout(() => {
                        if (demoBtn) {
                            demoBtn.disabled = false;
                            demoBtn.innerHTML = '🚀 Entrar no Painel da Loja';
                        }
                        if (dedicatedError && demoError && dedicatedError.style.display === 'block') {
                            demoError.style.display = 'block';
                            demoError.textContent = dedicatedError.textContent;
                        }
                    }, 600);
                });
            }
            
            adminClose.addEventListener('click', closeAdminPanel);
            adminOverlay.addEventListener('click', closeAdminPanel);
            
            document.getElementById('saveSettings').addEventListener('click', saveSettings);
            
            const companyCategorySelectEl = document.getElementById('companyCategorySelect');
            if (companyCategorySelectEl) {
                companyCategorySelectEl.addEventListener('change', (e) => {
                    updateCompanyCategory(e.target.value);
                });
            }
            
            // Product Modal
            addProductBtn.addEventListener('click', addProduct);
            modalClose.addEventListener('click', () => productModal.classList.remove('active'));
            productForm.addEventListener('submit', saveProduct);
            
            // Cart
            cartBtn.addEventListener('click', () => {
                const activeComp = (typeof companies !== 'undefined' && companies.find(c => c.id === activeCompanyId)) || settings;
                const isCurrentDemo = isCompanyDemo(activeComp);
                if (isCurrentDemo && !DemoTrialManager.isTrialActive()) {
                    openDemoLeadModal();
                    showNotification('📱 Digite seu número para liberar o cardápio e testar o carrinho por 24h!', 'info');
                    return;
                }
                cartSidebar.classList.add('active');
                cartOverlay.classList.add('active');
            });
            
            cartClose.addEventListener('click', closeCart);
            cartOverlay.addEventListener('click', (e) => {
                if (e.target === cartOverlay) closeCart();
            });
            
            btnCheckout.addEventListener('click', checkout);
            btnClear.addEventListener('click', clearCart);
            
            // Exportar HTML
            const btnExp = document.getElementById('exportHtmlBtn');
            if (btnExp) btnExp.addEventListener('click', exportHTML);
            
            // Atualizar status da loja a cada minuto
            setInterval(updateStoreStatus, 60000);

            // Sincronização em tempo real de pedidos entre abas/janelas
            window.addEventListener('storage', (e) => {
                const targetKey = `customerOrders_${activeCompanyId || 'company-demo-don'}`;
                if (e.key === 'customerOrders' || e.key === targetKey) {
                    try {
                        const parsed = JSON.parse(e.newValue || '[]');
                        if (Array.isArray(parsed)) {
                            customerOrders = parsed;
                            renderCustomerOrdersList();
                            renderAdminOrdersList();
                        }
                    } catch(err){}
                }
            });

            // Polling para sincronizar pedidos em tempo real diretamente do servidor central a cada 2.5s
            setInterval(() => {
                fetchOrdersFromServer(true);
            }, 2500);
        }

        function closeAdminPanel() {
            adminPanel.classList.remove('active');
            adminOverlay.classList.remove('active');
        }

        function closeCart() {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
        }

        // ========== EXPORTAR HTML ==========
        function exportHTML() {
            // Obter o HTML atual
            const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${settings.restaurantName} - Delivery</title>
    ${document.head.innerHTML}
</head>
<body>
    ${document.body.innerHTML}
    <script>
        // Dados pré-configurados
        const preloadedProducts = ${JSON.stringify(products)};
        const preloadedSettings = ${JSON.stringify(settings)};
        
        // Sobrescrever localStorage com dados exportados
        if (!localStorage.getItem('products')) {
            localStorage.setItem('products', JSON.stringify(preloadedProducts));
        }
        if (!localStorage.getItem('settings')) {
            localStorage.setItem('settings', JSON.stringify(preloadedSettings));
        }
    <\/script>
</body>
</html>`;

            // Criar blob e fazer download
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${settings.restaurantName.toLowerCase().replace(/\s+/g, '-')}-delivery.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('HTML exportado com sucesso! ✅', 'success');
        }

        // ========== QR CODE & ACESSO RÁPIDO ==========
        let currentQrScope = 'store'; // 'store' | 'portal'

        function openQrCodeModal(scope = 'store') {
            currentQrScope = scope;
            const modal = document.getElementById('qrCodeModal');
            if (!modal) return;
            updateQrCodeModalUI();
            modal.classList.add('active');
        }

        function closeQrCodeModal() {
            const modal = document.getElementById('qrCodeModal');
            if (modal) modal.classList.remove('active');
        }

        function switchQrScope(scope) {
            currentQrScope = scope;
            updateQrCodeModalUI();
        }

        function getActiveQrData() {
            const activeComp = getActiveCompany();
            if (currentQrScope === 'portal') {
                return {
                    title: 'Don Food • Plataforma Oficial',
                    url: 'https://www.donfood.site',
                    qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent('https://www.donfood.site')}`,
                    storeName: 'Don Food'
                };
            } else {
                const officialUrl = getCompanyOfficialUrl(activeComp);
                return {
                    title: activeComp.name || settings.restaurantName || 'Cardápio Digital',
                    url: officialUrl,
                    qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(officialUrl)}`,
                    storeName: activeComp.name || settings.restaurantName
                };
            }
        }

        function updateQrCodeModalUI() {
            const data = getActiveQrData();
            const titleEl = document.getElementById('qrCodeTargetTitle');
            const urlEl = document.getElementById('qrCodeTargetUrl');
            const imgEl = document.getElementById('qrCodeImage');
            const storeBtn = document.getElementById('qrScopeStoreBtn');
            const portalBtn = document.getElementById('qrScopePortalBtn');

            if (titleEl) titleEl.textContent = data.title;
            if (urlEl) urlEl.textContent = data.url;
            if (imgEl) imgEl.src = data.qrImageUrl;

            if (storeBtn && portalBtn) {
                if (currentQrScope === 'store') {
                    storeBtn.style.background = '#4F46E5';
                    storeBtn.style.color = '#FFFFFF';
                    portalBtn.style.background = 'transparent';
                    portalBtn.style.color = '#475569';
                } else {
                    portalBtn.style.background = '#4F46E5';
                    portalBtn.style.color = '#FFFFFF';
                    storeBtn.style.background = 'transparent';
                    storeBtn.style.color = '#475569';
                }
            }
        }

        function copyCurrentQrLink() {
            const data = getActiveQrData();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(data.url).then(() => {
                    showNotification(`Link copiado: ${data.url}`, 'success');
                }).catch(() => {
                    prompt('Copie o link abaixo:', data.url);
                });
            } else {
                prompt('Copie o link abaixo:', data.url);
            }
        }

        function shareCurrentQrWhatsApp() {
            const data = getActiveQrData();
            const msg = `🍕 Acesse nosso cardápio digital e faça seu pedido direto pelo celular: ${data.url}`;
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
        }

        async function downloadQrCodeImage() {
            const data = getActiveQrData();
            try {
                const response = await fetch(data.qrImageUrl);
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                const filename = (currentQrScope === 'portal') ? 'qrcode-donfood.png' : `qrcode-${(data.storeName || 'loja').toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);
                showNotification('QR Code baixado com sucesso! 📱📥', 'success');
            } catch(err) {
                window.open(data.qrImageUrl, '_blank');
            }
        }

        function printTableTentSign() {
            const data = getActiveQrData();
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                showNotification('Permita pop-ups para imprimir a plaquinha de mesa.', 'warning');
                return;
            }

            printWindow.document.write(`
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <title>Plaquinha de Mesa - ${data.storeName}</title>
                    <style>
                        @page { size: A5 portrait; margin: 10mm; }
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                            text-align: center;
                            margin: 0;
                            padding: 25px 20px;
                            background: #FFFFFF;
                            color: #1E1B4B;
                        }
                        .card {
                            border: 3.5px solid #4F46E5;
                            border-radius: 24px;
                            padding: 30px 20px;
                            max-width: 420px;
                            margin: 0 auto;
                            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                        }
                        .badge {
                            display: inline-block;
                            background: #4F46E5;
                            color: #FFFFFF;
                            padding: 6px 18px;
                            border-radius: 20px;
                            font-size: 13px;
                            font-weight: 800;
                            letter-spacing: 0.5px;
                            text-transform: uppercase;
                            margin-bottom: 12px;
                        }
                        h1 {
                            font-size: 26px;
                            margin: 5px 0 10px 0;
                            color: #1E1B4B;
                            font-weight: 900;
                        }
                        p.sub {
                            font-size: 15px;
                            color: #4B5563;
                            margin: 0 0 20px 0;
                            line-height: 1.4;
                        }
                        .qr-box {
                            background: #F8FAFC;
                            border: 2px dashed #818CF8;
                            border-radius: 20px;
                            padding: 16px;
                            display: inline-block;
                            margin-bottom: 16px;
                        }
                        .qr-box img {
                            width: 250px;
                            height: 250px;
                            display: block;
                        }
                        .url {
                            font-family: monospace;
                            font-size: 14px;
                            font-weight: bold;
                            color: #4F46E5;
                            word-break: break-all;
                            margin-bottom: 15px;
                            background: #EEF2FF;
                            padding: 6px 12px;
                            border-radius: 8px;
                            display: inline-block;
                        }
                        .footer-text {
                            font-size: 12px;
                            color: #6B7280;
                            border-top: 1px solid #E5E7EB;
                            padding-top: 12px;
                            font-weight: 600;
                        }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <div class="badge">📱 CARDÁPIO DIGITAL</div>
                        <h1>${data.storeName}</h1>
                        <p class="sub">Aponte a câmera do seu celular para fazer seu pedido na mesa ou balcão!</p>
                        <div class="qr-box">
                            <img src="${data.qrImageUrl}" alt="QR Code">
                        </div>
                        <br>
                        <div class="url">${data.url}</div>
                        <div class="footer-text">
                            Sem filas • Rápido e Seguro • Don Food
                        </div>
                    </div>
                    <script>
                        window.onload = function() {
                            setTimeout(() => { window.print(); }, 400);
                        };
                    <\/script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }

        // ========== AQUISIÇÃO DO DON FOOD & CALCULADORA DEMO ==========
        function updateDemoSavingsCalc(salesAmount, btnEl) {
            salesAmount = Number(salesAmount) || 15000;

            // Sincronizar botões rápidos
            document.querySelectorAll('.demo-calc-buttons .demo-calc-btn').forEach(btn => {
                const btnAmt = Number(btn.getAttribute('data-amount') || 0);
                if (btnAmt === salesAmount) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Sincronizar input range e background gradient
            const slider = document.getElementById('demoSavingsRangeSlider');
            if (slider) {
                slider.value = salesAmount;
                const min = Number(slider.min) || 1000;
                const max = Number(slider.max) || 25000;
                const percentage = Math.max(0, Math.min(100, ((salesAmount - min) / (max - min)) * 100));
                slider.style.background = `linear-gradient(to right, #EA580C 0%, #F59E0B ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`;
            }

            // Atualizar badge do slider
            const sliderBadge = document.getElementById('calcSliderCurrentBadge');
            if (sliderBadge) {
                sliderBadge.textContent = `R$ ${salesAmount.toLocaleString('pt-BR')} /mês`;
            }

            const rate = 0.15; // Média estimada de 15% cobrada por marketplaces
            const fee = salesAmount * rate;
            const annualSavings = fee * 12;

            const salesEl = document.getElementById('calcSalesDisplay');
            const feeEl = document.getElementById('calcFeeDisplay');
            const savingsEl = document.getElementById('calcSavingsDisplay');
            const annualSavingsEl = document.getElementById('calcAnnualSavingsDisplay');

            if (salesEl) salesEl.textContent = `R$ ${salesAmount.toLocaleString('pt-BR')}`;
            if (feeEl) feeEl.textContent = `- R$ ${fee.toLocaleString('pt-BR')}`;
            if (savingsEl) savingsEl.textContent = `R$ ${fee.toLocaleString('pt-BR')} /mês`;
            if (annualSavingsEl) annualSavingsEl.textContent = `R$ ${annualSavings.toLocaleString('pt-BR')} no seu bolso por ano!`;
        }

        function onDemoSavingsSliderChange(value) {
            updateDemoSavingsCalc(Number(value));
        }

        function openAcquireAppModal() {
            const modal = document.getElementById('acquireAppModal');
            if (modal) modal.classList.add('active');
        }

        function closeAcquireAppModal() {
            const modal = document.getElementById('acquireAppModal');
            if (modal) modal.classList.remove('active');
        }

        function toggleFaqItem(headerEl) {
            if (!headerEl) return;
            const item = headerEl.closest('.demo-faq-item');
            if (!item) return;

            const wasActive = item.classList.contains('active');
            
            // Fecha outros itens para efeito sanfona limpo
            const allItems = document.querySelectorAll('.demo-faq-item');
            allItems.forEach(i => i.classList.remove('active'));

            if (!wasActive) {
                item.classList.add('active');
            }
        }

        // ========== LGPD - POLÍTICA DE PRIVACIDADE E DIREITOS DOS TITULARES ==========
        function openLgpdPolicyModal() {
            const modal = document.getElementById('lgpdPolicyModal');
            if (modal) {
                modal.classList.add('active');
                modal.style.display = 'flex';
            }
        }

        function closeLgpdPolicyModal() {
            const modal = document.getElementById('lgpdPolicyModal');
            if (modal) {
                modal.classList.remove('active');
                modal.style.display = 'none';
            }
        }

        function openLgpdRightsModal() {
            const modal = document.getElementById('lgpdRightsModal');
            if (modal) {
                modal.classList.add('active');
                modal.style.display = 'flex';
                if (loggedCustomer) {
                    const nameInput = document.getElementById('lgpdCustomerName');
                    const emailInput = document.getElementById('lgpdCustomerEmail');
                    const phoneInput = document.getElementById('lgpdCustomerPhone');
                    if (nameInput && !nameInput.value) nameInput.value = loggedCustomer.name || '';
                    if (emailInput && !emailInput.value) emailInput.value = loggedCustomer.email || '';
                    if (phoneInput && !phoneInput.value) phoneInput.value = loggedCustomer.phone || '';
                }
            }
        }

        function closeLgpdRightsModal() {
            const modal = document.getElementById('lgpdRightsModal');
            if (modal) {
                modal.classList.remove('active');
                modal.style.display = 'none';
            }
        }

        function filterLgpdPolicy(query) {
            const term = (query || '').toLowerCase().trim();
            const cards = document.querySelectorAll('.lgpd-modal-card');
            cards.forEach(card => {
                if (!term) {
                    card.style.display = '';
                } else {
                    const text = card.textContent.toLowerCase();
                    card.style.display = text.includes(term) ? '' : 'none';
                }
            });
        }

        function printLgpdPolicy() {
            window.print();
        }

        function copyLgpdPolicyText() {
            const text = `POLÍTICA DE PRIVACIDADE E PROTEÇÃO DE DADOS (LGPD - LEI Nº 13.709/2018)\nDon Food Cardápio Digital & Delivery\n\nCompromisso: Seus dados são utilizados exclusivamente para entrega de pedidos e contato operacional com os estabelecimentos. Não comercializamos dados com terceiros.\n\nCanal DPO / Encarregado: dpo@donfood.com.br`;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    showNotification('Resumo da Política LGPD copiado com sucesso! 📋', 'success');
                }).catch(() => {
                    showNotification('Política LGPD copiada!', 'info');
                });
            } else {
                showNotification('Resumo copiado!', 'info');
            }
        }

        function handleLgpdRightsSubmit(event) {
            if (event) event.preventDefault();
            const name = document.getElementById('lgpdCustomerName')?.value.trim();
            const email = document.getElementById('lgpdCustomerEmail')?.value.trim();
            const phone = document.getElementById('lgpdCustomerPhone')?.value.trim();
            const rightType = document.getElementById('lgpdRightType')?.value || 'access';
            const details = document.getElementById('lgpdRequestDetails')?.value.trim();

            if (!name || !email) {
                showNotification('Por favor, preencha seu nome e e-mail para identificação do titular.', 'warning');
                return;
            }

            const protocol = 'LGPD-' + Math.floor(100000 + Math.random() * 900000);
            
            const lgpdRequests = JSON.parse(localStorage.getItem('lgpdRequests') || '[]');
            lgpdRequests.push({
                protocol,
                name,
                email,
                phone,
                rightType,
                details,
                date: new Date().toISOString(),
                status: 'OPEN'
            });
            localStorage.setItem('lgpdRequests', JSON.stringify(lgpdRequests));

            const rightLabels = {
                access: 'Acesso e Relatório Completo dos Meus Dados',
                correction: 'Correção ou Atualização de Dados Incompletos',
                deletion: 'Eliminação / Esquecimento de Dados Pessoais',
                revocation: 'Revogação de Consentimento',
                portability: 'Portabilidade de Dados para Outro Provedor',
                information: 'Informações sobre Compartilhamento com Terceiros'
            };

            const selectedLabel = rightLabels[rightType] || rightType;

            alert(`✅ Solicitação LGPD Registrada com Sucesso!\n\n📋 Protocolo: ${protocol}\n👤 Titular: ${name} (${email})\n⚖️ Direito Solicitado: ${selectedLabel}\n⏱️ Prazo Legal de Resposta: Até 15 dias úteis nos termos do Art. 19 da LGPD.\n\nNossa equipe de Proteção de Dados (DPO) entrará em contato.`);

            closeLgpdRightsModal();
            showNotification(`Protocolo ${protocol} gerado com sucesso! 🛡️`, 'success');
        }

        function sendLgpdTicketWhatsApp() {
            const activeComp = (companies && companies.find(c => c.id === activeCompanyId)) || settings;
            const waNumber = (activeComp.whatsappNumber || '5521973987378').replace(/\D/g, '');
            const msg = encodeURIComponent(`Olá! Gostaria de abrir um chamado formal sobre Privacidade e Proteção de Dados (LGPD) referente aos meus dados cadastrados no Don Food.`);
            window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');
        }

        function openDpoContact() {
            window.location.href = 'mailto:dpo@donfood.com.br?subject=Solicitacao%20de%20Direitos%20do%20Titular%20-%20LGPD';
        }

        function acceptLgpdConsent() {
            localStorage.setItem('donfood_lgpd_consent', 'accepted_' + new Date().toISOString());
            const banner = document.getElementById('lgpdConsentBanner');
            if (banner) {
                banner.style.opacity = '0';
                banner.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    banner.style.display = 'none';
                }, 300);
            }
            showNotification('Preferências de cookies e privacidade salvas! 🛡️', 'success');
        }

        function initLgpdConsentBanner() {
            const consent = localStorage.getItem('donfood_lgpd_consent');
            const banner = document.getElementById('lgpdConsentBanner');
            if (!consent && banner) {
                setTimeout(() => {
                    banner.style.display = 'block';
                    banner.style.opacity = '1';
                    banner.style.transform = 'translateY(0)';
                }, 1000);
            } else if (banner) {
                banner.style.display = 'none';
            }
        }

        // Expor todas as funções globais necessárias para eventos onclick do HTML
        window.toggleFaqItem = toggleFaqItem;
        window.updateDemoSavingsCalc = updateDemoSavingsCalc;
        window.onDemoSavingsSliderChange = onDemoSavingsSliderChange;
        window.openQrCodeModal = openQrCodeModal;
        window.closeQrCodeModal = closeQrCodeModal;
        window.switchQrScope = switchQrScope;
        window.copyCurrentQrLink = copyCurrentQrLink;
        window.shareCurrentQrWhatsApp = shareCurrentQrWhatsApp;
        window.downloadQrCodeImage = downloadQrCodeImage;
        window.printTableTentSign = printTableTentSign;
        window.openAcquireAppModal = openAcquireAppModal;
        window.closeAcquireAppModal = closeAcquireAppModal;
        window.applyCartCoupon = applyCartCoupon;
        window.removeAppliedCoupon = removeAppliedCoupon;
        window.handleAdminCreateCoupon = handleAdminCreateCoupon;
        window.toggleCouponActive = toggleCouponActive;
        window.deleteCoupon = deleteCoupon;

        // Funções de Gestão de Produtos (Admin)
        window.addProduct = addProduct;
        window.editProduct = editProduct;
        window.saveProduct = saveProduct;
        window.deleteProduct = deleteProduct;
        window.toggleProductAvailability = toggleProductAvailability;
        window.addPresetToProducts = addPresetToProducts;

        // Funções de Acompanhamentos e Banners (Admin)
        window.openIconPickerForInput = openIconPickerForInput;
        window.openIconPickerForExtrasChip = openIconPickerForExtrasChip;
        window.appendIconToInput = appendIconToInput;
        window.updateAdminExtrasChipField = updateAdminExtrasChipField;
        window.addAdminExtrasChipRow = addAdminExtrasChipRow;
        window.removeAdminExtrasChipRow = removeAdminExtrasChipRow;
        window.resetPromoBannerToCategoryDefault = resetPromoBannerToCategoryDefault;
        window.resetExtrasSectionToCategoryDefault = resetExtrasSectionToCategoryDefault;
        window.selectIconCategory = selectIconCategory;
        window.clearIconPickerSearch = clearIconPickerSearch;
        window.filterIconPickerList = filterIconPickerList;
        window.updateIconPreview = updateIconPreview;
        window.handleSelectIcon = handleSelectIcon;
        window.handleConfirmSelectedIcon = handleConfirmSelectedIcon;
        window.closeIconPickerModal = closeIconPickerModal;

        // Funções do Carrinho e Pedidos
        window.addToCart = addToCart;
        window.updateQuantity = updateQuantity;
        window.removeFromCart = removeFromCart;
        window.clearCart = clearCart;
        window.selectPaymentMethod = selectPaymentMethod;
        window.updateCashChangeValue = updateCashChangeValue;
        window.updateOrderStatus = updateOrderStatus;
        window.deleteOrder = deleteOrder;
        window.fetchOrdersFromServer = fetchOrdersFromServer;
        window.playNewOrderSound = playNewOrderSound;
        window.handleAdminOrderSearch = handleAdminOrderSearch;
        window.clearAdminOrderSearch = clearAdminOrderSearch;
        window.filterAdminOrdersByStatus = filterAdminOrdersByStatus;
        window.toggleAdminOrderExpand = toggleAdminOrderExpand;
        window.openAdminOrderDetailModal = openAdminOrderDetailModal;
        window.closeAdminOrderDetailModal = closeAdminOrderDetailModal;
        window.renderAdminOrdersList = renderAdminOrdersList;
        window.getActiveCompanyOrders = getActiveCompanyOrders;
        window.toggleAdminOrdersDropdown = toggleAdminOrdersDropdown;
        window.closeAdminOrdersDropdown = closeAdminOrdersDropdown;
        window.renderAdminOrdersDropdown = renderAdminOrdersDropdown;
        window.goToAdminOrder = goToAdminOrder;
        window.goToAdminOrdersList = goToAdminOrdersList;
        window.openCustomerOrdersModal = openCustomerOrdersModal;
        window.closeCustomerOrdersModal = closeCustomerOrdersModal;
        window.initSupabaseRealtimeOrders = initSupabaseRealtimeOrders;
        window.handleOrderRealtimeChange = handleOrderRealtimeChange;
        window.connectOrdersRealtimeStream = connectOrdersRealtimeStream;
        window.saveCustomerData = saveCustomerData;
        window.editCustomerData = editCustomerData;
        window.renderCustomerForm = renderCustomerForm;
        window.handleCustomerNeighborhoodChange = handleCustomerNeighborhoodChange;
        window.updateCheckoutButton = updateCheckoutButton;
        window.checkout = checkout;

        // Funções do Painel Dev e Multi-Empresa
        window.getActiveCompany = getActiveCompany;
        window.getActiveCompanyPresetType = getActiveCompanyPresetType;
        window.generateSlug = generateSlug;
        window.sanitizeSlug = sanitizeSlug;
        window.getCompanySlug = getCompanySlug;
        window.getCompanyOfficialUrl = getCompanyOfficialUrl;
        window.copyCompanyLink = copyCompanyLink;
        window.copyActiveCompanyOfficialLink = copyActiveCompanyOfficialLink;
        window.shareActiveCompanyWhatsApp = shareActiveCompanyWhatsApp;
        window.handleSlugSanitize = handleSlugSanitize;
        window.handleAdminNameSlugSync = handleAdminNameSlugSync;
        window.handleAdminSlugInput = handleAdminSlugInput;
        window.handleDevNewNameSlugSync = handleDevNewNameSlugSync;
        window.logoutDev = logoutDev;
        window.renderDevCustomerList = renderDevCustomerList;
        window.populateDevCustomerFilter = populateDevCustomerFilter;
        window.openEditCustomerByDev = openEditCustomerByDev;
        window.closeDevEditCustomerModal = closeDevEditCustomerModal;
        window.handleDevSaveEditCustomer = handleDevSaveEditCustomer;
        window.deleteCustomerByDev = deleteCustomerByDev;
        window.loadSampleMigrationData = loadSampleMigrationData;
        window.downloadCustomerTemplateCSV = downloadCustomerTemplateCSV;
        window.handleMigrationFileUpload = handleMigrationFileUpload;
        window.previewMigrationData = previewMigrationData;
        window.executeCustomerMigration = executeCustomerMigration;
        window.deleteCompanyByDev = deleteCompanyByDev;
        window.openEditCompanyByDev = openEditCompanyByDev;
        window.closeDevEditCompanyModal = closeDevEditCompanyModal;
        window.handleDevSaveEditCompany = handleDevSaveEditCompany;
        window.switchDevTab = switchDevTab;
        window.switchToDevView = switchToDevView;
        window.checkDevUrlRoute = checkDevUrlRoute;
        window.openDevPanelModal = openDevPanelModal;
        window.closeDevPanelModal = closeDevPanelModal;
        window.openDevPasswordModal = openDevPasswordModal;
        window.closeDevPasswordModal = closeDevPasswordModal;
        window.handleDevPasswordSubmit = handleDevPasswordSubmit;
        window.handleDevCreateCompany = handleDevCreateCompany;
        window.switchActiveCompany = switchActiveCompany;
        window.switchActiveCompanyFromSelect = switchActiveCompanyFromSelect;
        window.openStoreBySlug = openStoreBySlug;
        window.handleDevLogoClick = handleDevLogoClick;
        window.syncCurrentCompanyToSupabaseUI = syncCurrentCompanyToSupabaseUI;
        window.downloadSupabaseSQL = downloadSupabaseSQL;
        window.exportHTML = exportHTML;
        window.toggleHeroDescription = toggleHeroDescription;
        window.toggleProductDescription = toggleProductDescription;
        window.updateCompanyCategory = updateCompanyCategory;

        // Funções de Autenticação e Impressão
        window.showCustomConfirm = showCustomConfirm;
        window.openCustomConfirm = showCustomConfirm;
        window.closeCustomConfirm = closeCustomConfirm;
        window.togglePasswordVisibility = togglePasswordVisibility;
        window.openAdminLogin = openAdminLogin;
        window.logoutAdmin = logoutAdmin;
        window.openCustomerAuthModal = openCustomerAuthModal;
        window.closeCustomerAuthModal = closeCustomerAuthModal;
        window.switchAuthProfile = switchAuthProfile;
        window.switchAuthTab = switchAuthTab;
        window.handleGoogleCustomerAuth = handleGoogleCustomerAuth;
        window.triggerNativeGoogleSync = triggerNativeGoogleSync;
        window.openGoogleAccountPickerModal = openGoogleAccountPickerModal;
        window.closeGoogleAccountPickerModal = closeGoogleAccountPickerModal;
        window.openGoogleCustomAccountModal = openGoogleCustomAccountModal;
        window.closeGoogleCustomAccountModal = closeGoogleCustomAccountModal;
        window.backToGoogleAccountsPicker = backToGoogleAccountsPicker;
        window.appendEmailDomain = appendEmailDomain;
        window.updateGoogleAccountPreview = updateGoogleAccountPreview;
        window.handleGoogleCustomAccountSubmit = handleGoogleCustomAccountSubmit;
        window.selectGoogleAccount = selectGoogleAccount;
        window.handleGoogleCustomAccountPrompt = handleGoogleCustomAccountPrompt;
        window.processGoogleCustomerAuth = processGoogleCustomerAuth;
        window.openGoogleAddressModal = openGoogleAddressModal;
        window.closeGoogleAddressModal = closeGoogleAddressModal;
        window.populateGoogleAuthNeighborhoods = populateGoogleAuthNeighborhoods;
        window.handleGoogleAuthNeighborhoodChange = handleGoogleAuthNeighborhoodChange;
        window.handleGoogleAddressSubmit = handleGoogleAddressSubmit;
        window.handleUnifiedCompanyLogin = handleUnifiedCompanyLogin;
        window.populateAuthRegisterNeighborhoods = populateAuthRegisterNeighborhoods;
        window.handleAuthRegisterNeighborhoodChange = handleAuthRegisterNeighborhoodChange;
        window.logoutCustomer = logoutCustomer;
        window.toggleMobileHeaderMenu = toggleMobileHeaderMenu;
        window.closeMobileHeaderMenu = closeMobileHeaderMenu;
        window.updateMobileHeaderMenuUI = updateMobileHeaderMenuUI;
        window.openAcaiCustomizer = openAcaiCustomizer;
        window.closeAcaiCustomizer = closeAcaiCustomizer;
        window.confirmAcaiCustomization = confirmAcaiCustomization;
        window.triggerCartShake = triggerCartShake;
        window.goToPromoSlide = goToPromoSlide;
        window.applyPresetTheme = applyPresetTheme;
        window.connectBluetoothPrinter = connectBluetoothPrinter;
        window.connectUsbSerialPrinter = connectUsbSerialPrinter;
        window.disconnectPrinter = disconnectPrinter;
        window.testPrint58mm = testPrint58mm;

        // Diálogo de Confirmação Seguro
        window.showCustomConfirm = showCustomConfirm;
        window.closeCustomConfirm = closeCustomConfirm;

        // Centralizador de Autenticação e RBAC (Etapa 2)
        window.ROLES = ROLES;
        window.AuthManager = AuthManager;
        window.openAdminPanel = openAdminPanel;
        window.toggleCompanyPasswordVisibility = toggleCompanyPasswordVisibility;

        // Gerenciamento de Visualização SPA (Landing / Loja Demo / Login Dedicado)
        window.switchToStoreView = switchToStoreView;
        window.switchToLandingView = switchToLandingView;
        window.switchToLoginView = switchToLoginView;
        window.showRegisteredCompanyLoginForm = showRegisteredCompanyLoginForm;
        window.showDemoInfoPanel = showDemoInfoPanel;
        window.openAdminPanelFromLogin = openAdminPanelFromLogin;
        window.logoutAdminFromLogin = logoutAdminFromLogin;
        window.handleDedicatedCompanyChange = handleDedicatedCompanyChange;
        window.refreshDedicatedLoginUI = refreshDedicatedLoginUI;
        window.updateHeaderNavForCurrentView = updateHeaderNavForCurrentView;
        window.updateAppViewDisplay = updateAppViewDisplay;

        // Gerenciamento de Teste Grátis 24h na Loja Demo e Captação de Leads
        window.maskPhoneInput = maskPhoneInput;
        window.DemoTrialManager = DemoTrialManager;
        window.openDemoLeadModal = openDemoLeadModal;
        window.closeDemoLeadModal = closeDemoLeadModal;
        window.handleDemoLeadUnlockSubmit = handleDemoLeadUnlockSubmit;
        window.openDemoAdminBlockedModal = openDemoAdminBlockedModal;
        window.closeDemoAdminBlockedModal = closeDemoAdminBlockedModal;
        window.fetchDevLeads = fetchDevLeads;
        window.renderDevLeadsList = renderDevLeadsList;
        window.filterDevLeadsList = filterDevLeadsList;
        window.copyLeadPhone = copyLeadPhone;
        window.copyAllLeadPhones = copyAllLeadPhones;
        window.exportLeadsCSV = exportLeadsCSV;
        window.deleteDevLead = deleteDevLead;

        // Gerenciamento LGPD & Privacidade
        window.openLgpdPolicyModal = openLgpdPolicyModal;
        window.closeLgpdPolicyModal = closeLgpdPolicyModal;
        window.openLgpdRightsModal = openLgpdRightsModal;
        window.closeLgpdRightsModal = closeLgpdRightsModal;
        window.filterLgpdPolicy = filterLgpdPolicy;
        window.printLgpdPolicy = printLgpdPolicy;
        window.copyLgpdPolicyText = copyLgpdPolicyText;
        window.handleLgpdRightsSubmit = handleLgpdRightsSubmit;
        window.sendLgpdTicketWhatsApp = sendLgpdTicketWhatsApp;
        window.openDpoContact = openDpoContact;
        window.acceptLgpdConsent = acceptLgpdConsent;
        window.initLgpdConsentBanner = initLgpdConsentBanner;

        // ========== INICIAR APLICAÇÃO ==========
        init();