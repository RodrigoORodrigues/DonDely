/**
 * ============================================================================
 * DON DELIVERY - SISTEMA COMPLETO DE CARDÁPIO DIGITAL & GESTÃO MULTI-EMPRESA
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
                        { name: 'Morango', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Banana', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Kiwi', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Manga', price: 0, tag: 'Grátis (1/3)' }
                    ]
                },
                {
                    category: '🥣 Cereais e Crocantes',
                    items: [
                        { name: 'Granola', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Sucrilhos de Milho', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Cereal Ball Mesclado', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Argolinha Frutas Cítricas', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Flocos Crocantes de Chocolate', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Castanha', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Paçoca', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'M&M\'s', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Granulado Crocante Colorido', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Jujuba', price: 0, tag: 'Grátis (1/3)' }
                    ]
                },
                {
                    category: '🍫 Caldas & Coberturas',
                    items: [
                        { name: 'Nutella (Recheio & Cobertura)', price: 4.00, tag: '+R$ 4,00' },
                        { name: 'Leite em Pó Ninho', price: 3.00, tag: '+R$ 3,00' },
                        { name: 'Recheio e Cobertura de Chocolate', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Leite Condensado', price: 0, tag: 'Grátis (1/3)' }
                    ]
                },
                {
                    category: '🍌 Doces Especiais',
                    items: [
                        { name: 'Banana Caramelizada', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Jujubas Especiais', price: 0, tag: 'Grátis (1/3)' }
                    ]
                }
            ],
            marmitaria: [
                {
                    category: '🍳 Ovos e Proteínas Especiais',
                    items: [
                        { name: 'Ovo Frito de Gema Mole', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Ovo Cozido Fatiado', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Queijo Coalho Grelhado', price: 4.00, tag: '+R$ 4,00' },
                        { name: 'Torresmo Pururuca Crocante', price: 3.50, tag: '+R$ 3,50' }
                    ]
                },
                {
                    category: '🥗 Guarnições e Acompanhamentos Caseiros',
                    items: [
                        { name: 'Farofa Crocante de Bacon', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Banana Frita na Manteiga', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Salada de Maionese Caseira', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Vinagrete Fresco da Casa', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Couve Refogada na Manteiga', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Batata Palha Crocante', price: 0, tag: 'Grátis (1/3)' }
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
                        { name: 'Cebola Caramelizada', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Ovo Frito na Chapa', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Picles de Pepino Artesanal', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Hambúrguer Smash Extra (80g)', price: 8.00, tag: '+R$ 8,00' }
                    ]
                },
                {
                    category: '🥫 Molhos Especiais da Casa',
                    items: [
                        { name: 'Maionese Verde Temperada', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Molho Barbecue Defumado', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Maionese de Alho Assado', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Maionese de Pimenta Defumada', price: 0, tag: 'Grátis (1/3)' }
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
                        { name: 'Azeitonas Pretas Fatiadas', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Parmesão Ralado na Hora', price: 4.00, tag: '+R$ 4,00' },
                        { name: 'Milho Verde Selecionado', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Manjericão Fresco', price: 0, tag: 'Grátis (1/3)' }
                    ]
                }
            ],
            sorveteria: [
                {
                    category: '🍓 Frutas Frescas Selecionadas',
                    items: [
                        { name: 'Morango Fresco Fatiado', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Banana Fatiada', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Kiwi Selecionado', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Amora Fresca', price: 0, tag: 'Grátis (1/3)' }
                    ]
                },
                {
                    category: '🍫 Caldas & Coberturas',
                    items: [
                        { name: 'Nutella Pura Belga', price: 4.00, tag: '+R$ 4,00' },
                        { name: 'Leite Ninho Polvilhado', price: 3.00, tag: '+R$ 3,00' },
                        { name: 'Calda de Morango Artesanal', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Calda de Caramel Fudge', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Calda de Chocolate Quente', price: 0, tag: 'Grátis (1/3)' }
                    ]
                },
                {
                    category: '🍬 Confeites & Crocantes',
                    items: [
                        { name: 'M&Ms Crocantes', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Bis de Chocolate Picado', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Cereal Chocoball', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Granulado Colorido', price: 0, tag: 'Grátis (1/3)' }
                    ]
                }
            ],
            confeitaria: [
                {
                    category: '🧁 Recheios Gourmet',
                    items: [
                        { name: 'Nutella Pura Belga', price: 4.50, tag: '+R$ 4,50' },
                        { name: 'Morangos Selecionados', price: 3.50, tag: '+R$ 3,50' },
                        { name: 'Creme Ninho Tradicional', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Beijinho de Coco Cremoso', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Doce de Leite Artesanal', price: 0, tag: 'Grátis (1/3)' }
                    ]
                },
                {
                    category: '🍫 Coberturas Finas',
                    items: [
                        { name: 'Ganache de Chocolate Meio Amargo', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Raspas de Chocolate Belga', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Confeitos de Miçanga', price: 0, tag: 'Grátis (1/3)' }
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
                        { name: 'Molho Especial da Casa', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Maionese Grill Defumada', price: 0, tag: 'Grátis (1/3)' },
                        { name: 'Molho Mustard & Honey', price: 0, tag: 'Grátis (1/3)' }
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
            restaurantName: 'Açaí na Quentinha do FB',
            subtitle: 'Sabor que conquista na primeira colherada! Monte do seu jeito.',
            whatsappNumber: '5521972888819',
            instagram: '@acainaquentinha_do_fb',
            cnpj: '45.123.789/0001-90',
            address: 'Rua Principal, 123 - Centro',
            logoUrl: 'Logo.jpg',
            adminPassword: 'admin123',
            deliveryFee: 5.00,
            deliveryTime: '30 - 45 min',
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
            acai: {
                name: '🟣 Açaí Roxo (Padrão FB)',
                primary: '#59176B',
                primaryDark: '#3E0C4C',
                secondary: '#8B26A0',
                bgAccent: '#FAF5FF'
            },
            fastfood: {
                name: '🔴 Fast Food Vermelho',
                primary: '#DC2626',
                primaryDark: '#991B1B',
                secondary: '#EF4444',
                bgAccent: '#FEF2F2'
            },
            burguer: {
                name: '🟧 Hamburgueria Laranja',
                primary: '#EA580C',
                primaryDark: '#9A3412',
                secondary: '#F97316',
                bgAccent: '#FFF7ED'
            },
            pizzaria: {
                name: '🟢 Pizzaria Verde',
                primary: '#059669',
                primaryDark: '#065F46',
                secondary: '#10B981',
                bgAccent: '#ECFDF5'
            },
            sorveteria: {
                name: '🔵 Sorveteria Azul',
                primary: '#2563EB',
                primaryDark: '#1E40AF',
                secondary: '#3B82F6',
                bgAccent: '#EFF6FF'
            },
            confeitaria: {
                name: '🌸 Confeitaria Rosa',
                primary: '#DB2777',
                primaryDark: '#9D174D',
                secondary: '#EC4899',
                bgAccent: '#FDF2F8'
            },
            darkgourmet: {
                name: '🖤 Gourmet Gold',
                primary: '#1E1B4B',
                primaryDark: '#0F172A',
                secondary: '#D97706',
                bgAccent: '#18181B'
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
        let activeCompanyId = 'company-fb-default';

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

        // Alerta sonoro agradável para novos pedidos recebidos no painel da empresa
        function playNewOrderSound() {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) return;
                const ctx = new AudioCtx();
                if (ctx.state === 'suspended') {
                    ctx.resume();
                }
                const now = ctx.currentTime;
                // Tom duplo suave de notificação de pedido
                const osc1 = ctx.createOscillator();
                const gain1 = ctx.createGain();
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(587.33, now); // Ré (D5)
                gain1.gain.setValueAtTime(0.3, now);
                gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc1.connect(gain1);
                gain1.connect(ctx.destination);
                osc1.start(now);
                osc1.stop(now + 0.35);

                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(880, now + 0.18); // Lá (A5)
                gain2.gain.setValueAtTime(0.35, now + 0.18);
                gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.start(now + 0.18);
                osc2.stop(now + 0.65);
            } catch (e) {
                // AudioContext não disponível ou restrito pelo navegador
            }
        }

        // Sincronização em tempo real de pedidos com o servidor central
        async function fetchOrdersFromServer(silent = true) {
            if (isFetchingOrders) return;
            isFetchingOrders = true;
            try {
                const targetCompanyId = activeCompanyId || 'company-fb-default';
                const res = await fetch(`/api/orders?company_id=${encodeURIComponent(targetCompanyId)}`, {
                    headers: {
                        'x-company-id': targetCompanyId
                    }
                });
                if (!res.ok) throw new Error('Falha na resposta do servidor de pedidos');
                const json = await res.json();
                if (json && json.success && Array.isArray(json.data)) {
                    const serverOrders = json.data;

                    // Detectar se há novos pedidos que chegaram no servidor
                    if (knownOrderIds.size > 0) {
                        const newArrivals = serverOrders.filter(o => !knownOrderIds.has(o.id));
                        if (newArrivals.length > 0) {
                            playNewOrderSound();
                            const top = newArrivals[0];
                            const valFormatted = Number(top.total || 0).toFixed(2).replace('.', ',');
                            showNotification(`🔔 Novo Pedido Recebido: ${top.id} (${top.customerName || 'Cliente'}) - R$ ${valFormatted}!`, 'success');
                        }
                    }

                    // Atualizar conjunto de IDs conhecidos
                    knownOrderIds = new Set(serverOrders.map(o => o.id));

                    // Atualizar array em memória se houver diferença
                    if (JSON.stringify(serverOrders) !== JSON.stringify(customerOrders)) {
                        customerOrders = serverOrders;
                        localStorage.setItem(`customerOrders_${targetCompanyId}`, JSON.stringify(customerOrders));
                        renderAdminOrdersList();
                        renderCustomerOrdersList();
                    }
                }
            } catch (err) {
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

        // ========== INICIALIZAÇÃO ==========
        function init() {
            loadData();
            loadPrinterSettings();
            if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
                isAdminLoggedIn = true;
            }
            renderAll();
            updateAdminHeaderUI();
            renderPresetCatalog();
            attachEventListeners();
            // Buscar pedidos mais recentes no servidor central
            fetchOrdersFromServer(true);
        }

        // ========== APLICADOR DESSA PALETA DE CORES DINÂMICA ==========
        function applyThemeColors(theme) {
            if (!theme) theme = THEME_PRESETS.acai;
            const root = document.documentElement;
            root.style.setProperty('--primary', theme.primary || '#59176B');
            root.style.setProperty('--primary-dark', theme.primaryDark || '#3E0C4C');
            root.style.setProperty('--secondary', theme.secondary || '#8B26A0');
            root.style.setProperty('--bg-accent', theme.bgAccent || '#FAF5FF');

            // Atualizar os inputs de cor no Admin se já estiverem renderizados
            const pInput = document.getElementById('themePrimaryColor');
            const pdInput = document.getElementById('themePrimaryDarkColor');
            const sInput = document.getElementById('themeSecondaryColor');
            const bgInput = document.getElementById('themeBgAccentColor');

            if (pInput) pInput.value = theme.primary || '#59176B';
            if (pdInput) pdInput.value = theme.primaryDark || '#3E0C4C';
            if (sInput) sInput.value = theme.secondary || '#8B26A0';
            if (bgInput) bgInput.value = theme.bgAccent || '#FAF5FF';

            const pHex = document.getElementById('themePrimaryHex');
            const pdHex = document.getElementById('themePrimaryDarkHex');
            const sHex = document.getElementById('themeSecondaryHex');
            const bgHex = document.getElementById('themeBgAccentHex');

            if (pHex) pHex.textContent = (theme.primary || '#59176B').toUpperCase();
            if (pdHex) pdHex.textContent = (theme.primaryDark || '#3E0C4C').toUpperCase();
            if (sHex) sHex.textContent = (theme.secondary || '#8B26A0').toUpperCase();
            if (bgHex) bgHex.textContent = (theme.bgAccent || '#FAF5FF').toUpperCase();

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
                id: activeCompanyId || 'company-fb-default',
                name: (settings && settings.restaurantName) || 'Don Delivery',
                slug: (settings && settings.slug) || 'demo',
                presetType: (settings && settings.presetType) || 'acai',
                email: (settings && settings.email) || 'donfim@gmail.com',
                whatsappNumber: (settings && settings.whatsappNumber) || '5521972888819'
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
                    ${subtitle ? `<p class="promo-subtitle" style="color: #FEF08A; font-weight: 600; margin-top: 0.35rem;">${subtitle}</p>` : ''}
                </div>

                <div class="promo-carousel-wrapper" id="promoCarouselWrapper">
                    <div class="promo-options" id="promoOptionsTrack">
                        ${renderCards.map((card, idx) => {
                            const originalIdx = idx % cards.length;
                            return `
                                <div class="promo-option-card ${originalIdx === 0 ? 'highlight' : ''}" data-original-index="${originalIdx}" data-index="${idx}">
                                    <div class="promo-option-icon">${card.icon || ''}</div>
                                    <div class="promo-option-title">${card.title || ''}</div>
                                    <small style="color: #CBD5E1;">${card.desc || ''}</small>
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

            if (extrasData.categories && Array.isArray(extrasData.categories) && extrasData.categories.length > 0) {
                categoriesList = extrasData.categories;
            } else if (extrasData.chips && Array.isArray(extrasData.chips)) {
                categoriesList = [{
                    name: extrasData.categoryName || (defaultData.categories && defaultData.categories[0] ? defaultData.categories[0].name : 'Acompanhamentos'),
                    chips: extrasData.chips
                }];
            } else if (defaultData.categories && Array.isArray(defaultData.categories)) {
                categoriesList = defaultData.categories;
            }

            const categoriesContent = categoriesList.map(cat => `
                <div style="margin-bottom: 2rem;">
                    ${cat.name ? `<div class="ingredients-category-title">${cat.name}</div>` : ''}
                    <div class="ingredients-grid">
                        ${(cat.chips || []).map(chip => `
                            <div class="ingredient-chip">
                                <span>${chip.icon || '✨'}</span> ${chip.name || ''}
                                ${chip.price ? `<span class="ingredient-chip-price">${chip.price}</span>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');

            sectionEl.innerHTML = `
                <div style="text-align: center; margin-bottom: 2rem;">
                    ${badge ? `<span style="background: var(--primary); color: var(--white); font-weight: 800; padding: 0.4rem 1.2rem; border-radius: 30px; font-size: 0.85rem; display: inline-block; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">${badge}</span>` : ''}
                    ${title ? `<h3 style="font-size: 1.6rem; color: var(--primary-dark); font-weight: 800; margin-top: 0.5rem;">${title}</h3>` : ''}
                    ${desc ? `<p style="color: var(--gray-600); max-width: 600px; margin: 0.5rem auto 0; font-size: 0.95rem;">${desc}</p>` : ''}
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
                name: 'Açaí na Quentinha do FB',
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
            const template = PRESET_CATALOGS_BY_CATEGORY[presetKey] || PRESET_CATALOGS_BY_CATEGORY.acai;
            products = template.map((item, idx) => ({
                id: (Date.now() + idx),
                name: item.name,
                tag: item.tag || '',
                description: item.description,
                price: item.price,
                image: item.image,
                available: true,
                isCustomizable: item.isCustomizable !== undefined ? item.isCustomizable : (item.isAcai !== undefined ? item.isAcai : true)
            }));

            // Resetar banners customizados e acompanhamentos para carregar os padrões da nova categoria
            settings.customBanner = null;
            settings.customExtras = null;

            let activeComp = companies.find(c => c.id === activeCompanyId);
            if (activeComp) {
                activeComp.name = settings.restaurantName;
                activeComp.subtitle = settings.subtitle;
                activeComp.presetType = presetKey;
                activeComp.deliveryTime = settings.deliveryTime;
                activeComp.deliveryFee = settings.deliveryFee;
                activeComp.themeColors = settings.themeColors;
                activeComp.customBanner = null;
                activeComp.customExtras = null;
                activeComp.products = products;
            }

            applyThemeColors(settings.themeColors);
            renderAll();
            saveData();
            showNotification(`Sistema e cardápio completamente atualizados para "${profile.name}"! 🚀🎨`, 'success');
        }

        // ========== FUNÇÕES UTILITÁRIAS DE SLUGS E LINKS DE ACESSO (dondelivery.site) ==========
        function sanitizeSlug(text) {
            if (!text) return '';
            return text
                .toString()
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
                .substring(0, 40);
        }

        function generateSlug(text) {
            const clean = sanitizeSlug(text);
            return clean || ('loja-' + Date.now().toString(36));
        }

        function getCompanySlug(comp) {
            if (!comp) return 'demo';
            if (comp.slug) return sanitizeSlug(comp.slug);
            if (comp.isDemo || comp.id === 'company-demo-don') return 'demo';
            if (comp.id === 'company-fb-default') return 'acai-fb';
            return generateSlug(comp.name || comp.id);
        }

        function getCompanyOfficialUrl(comp) {
            const slug = getCompanySlug(comp);
            return `https://dondelivery.site/?empresa=${encodeURIComponent(slug)}`;
        }

        function getCompanyCurrentUrl(comp) {
            const slug = getCompanySlug(comp);
            return `${window.location.origin}/?empresa=${encodeURIComponent(slug)}`;
        }

        function copyActiveCompanyOfficialLink() {
            let activeComp = companies.find(c => c.id === activeCompanyId);
            const url = getCompanyOfficialUrl(activeComp);
            navigator.clipboard.writeText(url).then(() => {
                showNotification(`Link oficial copiado: ${url} 📋`, 'success');
            }).catch(() => {
                prompt('Copie o link oficial do seu cardápio:', url);
            });
        }

        function shareActiveCompanyWhatsApp() {
            let activeComp = companies.find(c => c.id === activeCompanyId);
            const url = getCompanyOfficialUrl(activeComp);
            const name = activeComp ? activeComp.name : settings.restaurantName;
            const text = encodeURIComponent(`Olá! Confira nosso cardápio digital completo e faça seu pedido online no *${name}* através do link oficial:\n${url}`);
            window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
        }

        function copyCompanyLink(slugOrId) {
            const comp = companies.find(c => c.slug === slugOrId || c.id === slugOrId || getCompanySlug(c) === slugOrId);
            const url = getCompanyOfficialUrl(comp);
            navigator.clipboard.writeText(url).then(() => {
                showNotification(`Link oficial copiado: ${url} 📋`, 'success');
            }).catch(() => {
                prompt('Copie o link oficial:', url);
            });
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
            const slugInput = document.getElementById('restaurantSlug');
            const slugVal = (slugInput && slugInput.value.trim()) || 'sua-loja';
            const urlText = document.getElementById('adminCompanyShareUrlText');
            const slugBadge = document.getElementById('adminCompanySlugBadge');
            const openBtn = document.getElementById('adminCompanyOpenLinkBtn');
            
            if (urlText) urlText.textContent = `https://dondelivery.site/?empresa=${slugVal}`;
            if (slugBadge) slugBadge.textContent = `dondelivery.site/?empresa=${slugVal}`;
            if (openBtn) openBtn.href = `${window.location.origin}/?empresa=${slugVal}`;
        }

        // ========== ARQUITETURA MULTI-EMPRESA UNIVERSAL & ISOLAMENTO DE BANCO DE DADOS ==========
        const defaultDemoCompany = {
            id: 'company-demo-don',
            slug: 'demo',
            isDemo: true,
            name: 'Don Delivery',
            email: 'demo@dondelivery.site',
            subtitle: 'Cardápio Digital & Delivery Oficial! Faça seu pedido teste e monte do seu jeito.',
            whatsappNumber: '5521999999999',
            instagram: '@dondelivery.site',
            cnpj: '00.000.000/0001-99',
            address: 'Av. Brasil, 500 - Loja Modelo',
            logoUrl: 'Logo_Don.png',
            adminPassword: 'admin',
            deliveryFee: 5.00,
            deliveryTime: '25 - 40 min',
            presetType: 'burguer',
            themeColors: {
                primary: '#0284C7',
                primaryDark: '#0369A1',
                secondary: '#38BDF8',
                bgAccent: '#F0F9FF'
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
                    isAcai: false
                },
                {
                    id: 201,
                    name: '🍕 Pizza Calabresa Artesanal Especial',
                    tag: '🍕 PIZZARIA',
                    description: 'Massa artesanal italiana de longa fermentação, molho pelati fresco, calabresa selecionada fatiada, muçarela derretida, cebola roxa e orégano.',
                    price: 45.00,
                    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&fit=crop',
                    available: true,
                    isAcai: false
                },
                {
                    id: 1,
                    name: '🍧 Copo de Açaí Supremo 500ml Turbinado',
                    tag: '🍧 AÇAÍ & SORVETES',
                    description: 'Açaí artesanal super cremoso montado em camadas com Leite Ninho, Nutella pura, Morangos frescos fatiados, Banana e Granola crocante + adicionais à sua escolha.',
                    price: 22.90,
                    image: 'acai_copo.svg',
                    available: true,
                    isAcai: true
                },
                {
                    id: 301,
                    name: '🍱 Marmita Executiva Bife Acebolado Premium',
                    tag: '🍱 MARMITARIA',
                    description: 'Bife bovino macio grelhado na chapa com cebolas douradas, arroz branco soltinho, feijão carioca fresquinho, farofa crocante e salada da horta.',
                    price: 24.90,
                    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&fit=crop',
                    available: true,
                    isAcai: false
                },
                {
                    id: 401,
                    name: '🍰 Bolo de Pote Ninho com Nutella & Morango',
                    tag: '🍰 CONFEITARIA',
                    description: 'Pão de ló leve e molhadinho intercalado com camadas generosas de brigadeiro de Leite Ninho, Nutella pura e pedaços de morangos frescos.',
                    price: 14.50,
                    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&fit=crop',
                    available: true,
                    isAcai: false
                },
                {
                    id: 104,
                    name: '🥤 Coca-Cola Original Lata 350ml Geladíssima',
                    tag: '🥤 BEBIDAS',
                    description: 'Lata 350ml trincando de gelada com limão e gelo sob consulta.',
                    price: 6.50,
                    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&fit=crop',
                    available: true,
                    isAcai: false
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

        const defaultFB = {
            id: 'company-fb-default',
            slug: 'acai-fb',
            isDemo: false,
            name: 'Açaí na Quentinha do FB',
            email: 'donfim@gmail.com',
            subtitle: 'Sabor que conquista na primeira colherada! Monte do seu jeito.',
            whatsappNumber: '5521972888819',
            instagram: '@acainaquentinha_do_fb',
            cnpj: '45.123.789/0001-90',
            address: 'Rua Principal, 123 - Centro',
            logoUrl: 'Logo.jpg',
            adminPassword: 'admin123',
            deliveryFee: 5.00,
            deliveryTime: '30 - 45 min',
            presetType: 'acai',
            themeColors: {
                primary: '#59176B',
                primaryDark: '#3E0C4C',
                secondary: '#8B26A0',
                bgAccent: '#FAF5FF'
            },
            coupons: defaultCoupons,
            products: defaultProducts,
            schedule: defaultSettings.schedule
        };

        function loadData() {
            // 1. Carregar Coleção de Empresas
            const savedCompanies = localStorage.getItem('companies');
            if (savedCompanies) {
                try {
                    companies = JSON.parse(savedCompanies);
                } catch(e) { companies = []; }
            }

            // Se nenhuma empresa cadastrada, inicializar com a Loja Demonstração e a Empresa FB
            if (!companies || companies.length === 0) {
                companies = [defaultDemoCompany, defaultFB];
                localStorage.setItem('companies', JSON.stringify(companies));
            } else {
                // Garantir integridade dos Slugs e garantir que a empresa de demonstração exista
                let hasDemo = companies.some(c => c.id === 'company-demo-don' || c.isDemo || c.slug === 'demo');
                if (!hasDemo) {
                    companies.unshift(defaultDemoCompany);
                }
                let hasFB = companies.some(c => c.id === 'company-fb-default');
                if (!hasFB) {
                    companies.push(defaultFB);
                }
                // Garantir que cada empresa tenha slug, logo e produtos da demo atualizados
                companies.forEach(comp => {
                     comp.slug = getCompanySlug(comp);
                     if (comp.id === 'company-demo-don' || comp.isDemo || comp.slug === 'demo') {
                         if (!comp.name || comp.name.includes('Don Burguer')) {
                             comp.name = 'Don Delivery';
                         }
                         comp.logoUrl = 'Logo_Don.png';
                         // Atualizar os produtos da demo com a vitrine diversificada
                         comp.products = defaultDemoCompany.products;
                     }
                });
                localStorage.setItem('companies', JSON.stringify(companies));
            }

            // 2. Determinar Empresa Ativa a partir da URL (Roteamento Dinâmico por Link: ?empresa=slug ou /slug)
            const urlParams = new URLSearchParams(window.location.search);
            const requestedParam = urlParams.get('empresa') || urlParams.get('loja') || urlParams.get('c') || urlParams.get('slug') || urlParams.get('tenant');
            
            let targetCompany = null;

            if (requestedParam) {
                const cleanParam = requestedParam.trim().toLowerCase();
                targetCompany = companies.find(c => 
                    (c.slug && c.slug.toLowerCase() === cleanParam) || 
                    (c.id && c.id.toLowerCase() === cleanParam) ||
                    (cleanParam === 'demo' && (c.isDemo || c.id === 'company-demo-don')) ||
                    (cleanParam === 'fb' && c.id === 'company-fb-default')
                );
            }

            // Fallback por pathname se for rota direta como /demo ou /acai-fb
            if (!targetCompany && window.location.pathname && window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
                const pathSlug = window.location.pathname.replace(/^\/+/, '').split('/')[0].toLowerCase();
                if (pathSlug && !pathSlug.endsWith('.js') && !pathSlug.endsWith('.css') && !pathSlug.endsWith('.png') && !pathSlug.endsWith('.jpg') && !pathSlug.endsWith('.svg') && !pathSlug.endsWith('.json') && !pathSlug.endsWith('.sql') && pathSlug !== 'api') {
                    targetCompany = companies.find(c => 
                        (c.slug && c.slug.toLowerCase() === pathSlug) || 
                        (c.id && c.id.toLowerCase() === pathSlug)
                    );
                }
            }

            if (targetCompany) {
                activeCompanyId = targetCompany.id;
                localStorage.setItem('activeCompanyId', activeCompanyId);
            } else {
                // Se acessou link principal sem parâmetros e não há preferência recente:
                const savedActiveId = localStorage.getItem('activeCompanyId');
                if (savedActiveId && companies.some(c => c.id === savedActiveId)) {
                    activeCompanyId = savedActiveId;
                } else {
                    // Padrão de apresentação no link principal: Loja Demonstração
                    const demoComp = companies.find(c => c.isDemo || c.slug === 'demo' || c.id === 'company-demo-don');
                    activeCompanyId = demoComp ? demoComp.id : companies[0].id;
                    localStorage.setItem('activeCompanyId', activeCompanyId);
                }
            }

            let activeComp = companies.find(c => c.id === activeCompanyId);
            if (!activeComp) {
                activeComp = companies[0];
                activeCompanyId = activeComp.id;
            }

            // 3. Atualizar Visibilidade do Banner de Demonstração e Landing Page Showcase
            const isCurrentDemo = activeComp.isDemo || activeComp.slug === 'demo' || activeComp.id === 'company-demo-don';
            const demoBar = document.getElementById('demoNoticeBar');
            if (demoBar) {
                demoBar.style.display = isCurrentDemo ? 'block' : 'none';
            }
            const demoHero = document.getElementById('demoLandingHero');
            const heroSection = document.getElementById('inicio');
            if (demoHero) {
                demoHero.style.display = isCurrentDemo ? 'block' : 'none';
            }
            if (heroSection) {
                if (isCurrentDemo) {
                    heroSection.classList.add('has-demo-landing');
                } else {
                    heroSection.classList.remove('has-demo-landing');
                }
            }

            // 3. Carregar Configurações, Produtos e Pedidos ISOLADOS por Empresa (Database Isolation)
            settings = {
                restaurantName: activeComp.name,
                email: activeComp.email || 'donfim@gmail.com',
                subtitle: activeComp.subtitle,
                whatsappNumber: activeComp.whatsappNumber,
                instagram: activeComp.instagram || (activeComp.id === 'company-fb-default' ? '@acainaquentinha_do_fb' : ''),
                cnpj: activeComp.cnpj || (activeComp.id === 'company-fb-default' ? '45.123.789/0001-90' : ''),
                address: activeComp.address || '',
                logoUrl: activeComp.logoUrl,
                adminPassword: activeComp.adminPassword,
                deliveryFee: activeComp.deliveryFee || 5.00,
                deliveryTime: activeComp.deliveryTime || '30 - 45 min',
                presetType: activeComp.presetType || 'acai',
                schedule: activeComp.schedule || defaultSettings.schedule,
                themeColors: activeComp.themeColors || THEME_PRESETS.acai,
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

            // Para a empresa FB, garantir que Super Barca use o SVG original do FB
            if (activeComp.id === 'company-fb-default') {
                let barca = products.find(p => p.name.toLowerCase().includes('barca'));
                if (!barca) {
                    barca = {
                        id: 1,
                        name: 'Super Barca de Açaí - O mais pedido!',
                        tag: '🔥 O MAIS PEDIDO!',
                        description: 'Super Barca Recheada! Acompanha Kiwi, Banana, Cereais, Chocolate Flakes, Granulado, Cremes Especiais e Wafer + 3 acompanhamentos grátis da sua escolha.',
                        price: 34.99,
                        image: 'super_barca.svg',
                        available: true,
                        isAcai: true
                    };
                    products.unshift(barca);
                }
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
        }

        function switchActiveCompany(companyId) {
            activeCompanyId = companyId;
            localStorage.setItem('activeCompanyId', activeCompanyId);
            loadData();
            renderAll();
            showNotification(`Empresa alternada para: ${settings.restaurantName} 🏪`, 'success');
        }

        function switchActiveCompanyFromSelect(companyId) {
            switchActiveCompany(companyId);
        }

        function renderActiveCompanySelectUI() {
            const select = document.getElementById('activeCompanySelect');
            if (!select) return;
            select.innerHTML = companies.map(c => `
                <option value="${c.id}" ${c.id === activeCompanyId ? 'selected' : ''}>
                    ${c.name} (${c.whatsappNumber || 'Sem Whats'}) ${c.id === 'company-fb-default' ? '★ Padrao' : ''}
                </option>
            `).join('');
        }

        // ========== GERENCIAMENTO DO ACESSO OCULTO DEVELOPER (10 CLIQUES) ==========
        function handleDevLogoClick(e) {
            if (e) e.preventDefault();
            devClickCounter++;
            clearTimeout(devClickTimer);

            // Se atingir os 10 cliques, abre o painel Dev diretamente
            if (devClickCounter >= 10) {
                devClickCounter = 0;
                showNotification('🛠️ Acesso Desenvolvedor Don Delivery desbloqueado!', 'success');
                openDevPasswordModal();
            } else {
                // Notificação sutil para guiar quando estiver próximo dos 10 cliques
                if (devClickCounter >= 6) {
                    showNotification(`Modo Dev: clique mais ${10 - devClickCounter} vezes...`, 'info');
                }
                devClickTimer = setTimeout(() => { 
                    devClickCounter = 0; 
                }, 3000); // 3 segundos de janela entre cliques rápidos
            }
        }

        // Atalho de Teclado secreto: Ctrl + Shift + D e Tecla Esc para Modais
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
                e.preventDefault();
                openDevPasswordModal();
            } else if (e.key === 'Escape') {
                const iconModal = document.getElementById('iconPickerModal');
                if (iconModal && iconModal.style.display === 'flex') {
                    closeIconPickerModal();
                }
            }
        });

        function openDevPasswordModal() {
            if (sessionStorage.getItem('isDevLoggedIn') === 'true') {
                openDevPanelModal();
                return;
            }
            const modal = document.getElementById('devPasswordModal');
            if (modal) modal.classList.add('active');
            const input = document.getElementById('devPasswordInput');
            if (input) {
                input.value = '';
                input.focus();
            }
            const err = document.getElementById('devPasswordError');
            if (err) err.style.display = 'none';
        }

        function closeDevPasswordModal() {
            const modal = document.getElementById('devPasswordModal');
            if (modal) modal.classList.remove('active');
        }

        function handleDevPasswordSubmit(e) {
            if (e) e.preventDefault();
            const input = document.getElementById('devPasswordInput').value.trim();
            if (input === 'admin123' || input === 'donfimdev' || input === 'donfim' || input === '123456') {
                sessionStorage.setItem('isDevLoggedIn', 'true');
                closeDevPasswordModal();
                openDevPanelModal();
                showNotification('Acesso Desenvolvedor concedido! 🛠️', 'success');
            } else {
                const err = document.getElementById('devPasswordError');
                if (err) err.style.display = 'block';
            }
        }

        function openDevPanelModal() {
            const modal = document.getElementById('devPanelModal');
            if (modal) modal.classList.add('active');
            renderDevCompanyList();
            switchDevTab('companies');
        }

        function closeDevPanelModal() {
            const modal = document.getElementById('devPanelModal');
            if (modal) modal.classList.remove('active');
        }

        function logoutDev() {
            sessionStorage.removeItem('isDevLoggedIn');
            closeDevPanelModal();
            showNotification('Sessão de Desenvolvedor encerrada.', 'info');
        }

        function switchDevTab(tab) {
            const compTab = document.getElementById('devTabCompanies');
            const custTab = document.getElementById('devTabCustomers');
            const migrateTab = document.getElementById('devTabMigrate');
            const createTab = document.getElementById('devTabCreate');
            const supTab = document.getElementById('devTabSupabase');
            const compBtn = document.getElementById('devTabCompaniesBtn');
            const custBtn = document.getElementById('devTabCustomersBtn');
            const migrateBtn = document.getElementById('devTabMigrateBtn');
            const createBtn = document.getElementById('devTabCreateBtn');
            const supBtn = document.getElementById('devTabSupabaseBtn');

            if (compTab) compTab.style.display = tab === 'companies' ? 'block' : 'none';
            if (custTab) custTab.style.display = tab === 'customers' ? 'block' : 'none';
            if (migrateTab) migrateTab.style.display = tab === 'migrate' ? 'block' : 'none';
            if (createTab) createTab.style.display = tab === 'create' ? 'block' : 'none';
            if (supTab) supTab.style.display = tab === 'supabase' ? 'block' : 'none';

            if (compBtn) {
                compBtn.style.background = tab === 'companies' ? '#4F46E5' : 'var(--gray-200)';
                compBtn.style.color = tab === 'companies' ? 'white' : 'var(--gray-800)';
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

            if (tab === 'customers') {
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
                const compId = ord.companyId || activeCompanyId || 'company-fb-default';
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
            if (nameEl) nameEl.textContent = activeComp.name || 'Empresa Padrão';
            if (idEl) idEl.textContent = `Tenant ID: ${activeCompanyId || 'company-fb-default'}`;

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
            const compId = activeCompanyId || 'company-fb-default';

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

        function downloadSupabaseSQL() {
            window.open('/supabase_schema.sql', '_blank');
        }

        function renderDevCompanyList() {
            const container = document.getElementById('devCompanyList');
            const countBadge = document.getElementById('devCompanyCount');
            if (countBadge) countBadge.textContent = companies.length;

            if (!container) return;
            container.innerHTML = companies.map(comp => {
                const isActive = comp.id === activeCompanyId;
                const isDefaultFB = comp.id === 'company-fb-default';
                const isDemo = comp.isDemo || comp.id === 'company-demo-don' || comp.slug === 'demo';
                const compEmail = comp.email || 'donfim@gmail.com';
                const compSlug = getCompanySlug(comp);
                const officialUrl = getCompanyOfficialUrl(comp);

                return `
                    <div style="background: ${isActive ? '#EEF2FF' : '#F8FAFC'}; border: 1.5px solid ${isActive ? '#6366F1' : '#E2E8F0'}; border-radius: 10px; padding: 0.85rem 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap;">
                            <div>
                                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; flex-wrap: wrap;">
                                    <strong style="font-size: 0.95rem; color: #1E1B4B;">${comp.name}</strong>
                                    ${isActive ? '<span style="background: #4F46E5; color: white; font-size: 0.65rem; font-weight: bold; padding: 2px 6px; border-radius: 10px;">★ ATIVA</span>' : ''}
                                    ${isDemo ? '<span style="background: #EA580C; color: white; font-size: 0.65rem; font-weight: bold; padding: 2px 6px; border-radius: 10px;">✨ DEMO PRINCIPAL</span>' : ''}
                                    ${isDefaultFB ? '<span style="background: #8B26A0; color: white; font-size: 0.65rem; font-weight: bold; padding: 2px 6px; border-radius: 10px;">PADRÃO FB</span>' : ''}
                                </div>
                                <div style="font-size: 0.8rem; color: var(--gray-600); display: flex; gap: 0.8rem; flex-wrap: wrap;">
                                    <span>📧 E-mail: <strong>${compEmail}</strong></span>
                                    <span>📱 WhatsApp: <strong>${comp.whatsappNumber}</strong></span>
                                    <span>🔑 Senha: <strong>${comp.adminPassword}</strong></span>
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
                                ${(!isDefaultFB && !isDemo) ? `
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

        function handleDevCreateCompany(e) {
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
            switchActiveCompany(newCompanyId);
            renderDevCompanyList();
            alert(`🎉 Empresa "${name}" cadastrada com sucesso!\n🌐 Link Oficial: https://dondelivery.site/?empresa=${slug}\n📧 E-mail de Login: ${email}\n🔑 Senha: ${password}`);
            switchDevTab('companies');
        }

        async function deleteCompanyByDev(companyId) {
            if (companyId === 'company-fb-default') {
                showNotification('Não é permitido excluir a empresa padrão "Açaí na Quentinha do FB".', 'warning');
                return;
            }
            if (companyId === 'company-demo-don') {
                showNotification('Não é permitido excluir a empresa de demonstração principal.', 'warning');
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

        function handleDevSaveEditCompany(e) {
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
            updateAdminShareLinkDisplay();

            if (document.getElementById('companyEmail')) {
                document.getElementById('companyEmail').value = settings.email || 'donfim@gmail.com';
            }
            document.getElementById('logoUrl').value = settings.logoUrl || '';
            document.getElementById('restaurantSubtitle').value = settings.subtitle || '';
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

                // Configurações do Hero (Imagem invés do texto)
                heroLogo.src = settings.logoUrl;
                heroLogo.alt = settings.restaurantName;
                heroLogo.onerror = function() {
                    if (this.src.indexOf('Logo_Don.png') === -1) {
                        this.src = '/Logo_Don.png';
                    }
                };
                heroLogo.style.display = 'block'; // Mostra a imagem
                heroRestaurantName.style.display = 'none'; // Esconde o texto H1
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
            
            // Atualizar card hero com produto de destaque
            const featuredProduct = products.find(p => p.name.toLowerCase().includes('barca')) || products.find(p => p.available);
            if (featuredProduct) {
                document.getElementById('heroCard').innerHTML = `
                    <div style="position: absolute; top: 12px; right: 12px; background: #EAB308; color: #000; font-weight: 800; font-size: 0.75rem; padding: 4px 12px; border-radius: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: 2;">🔥 O MAIS PEDIDO!</div>
                    <img src="${featuredProduct.image}" alt="${featuredProduct.name}" onerror="this.onerror=null; this.src='super_barca.svg';">
                    <h3>${featuredProduct.name}</h3>
                    <p>${featuredProduct.description}</p>
                    <div class="hero-card-price">R$ ${featuredProduct.price.toFixed(2).replace('.', ',')}</div>
                `;
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
            if (products.length === 0) {
                productsGrid.innerHTML = '<p style="text-align: center; color: var(--gray-600); grid-column: 1/-1;">Nenhum produto cadastrado ainda.</p>';
                return;
            }
            
            const presetKey = getActiveCompanyPresetType();

            productsGrid.innerHTML = products.map(product => {
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
                        ? `<span class="product-badge" style="background:#EAB308; color:#000; font-weight:800; border: 1px solid #CA8A04;">${product.tag}</span>` 
                        : (isCustomizable ? '<span class="product-badge" style="background:var(--primary);">Acompanhamentos</span>' : ''));

                return `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.onerror=null; this.src='acai_300ml.svg';">
                    ${badgeHtml}
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-footer">
                            <span class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
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

        // ========== INTERACTIVE PRODUCT CUSTOMIZER (POR CATEGORIA) ==========
        function openAcaiCustomizer(productId) {
            const product = products.find(p => p.id === productId);
            if (!product || !product.available) return;

            activeCustomizingProduct = product;
            selectedIngredients = [];

            const presetKey = getActiveCompanyPresetType();
            let titlePrefix = "Monte seu";
            let subtitleText = `3 acompanhamentos inclusos no preço (R$ ${product.price.toFixed(2).replace('.', ',')})`;

            if (presetKey === 'marmitaria') {
                titlePrefix = "Monte sua";
                subtitleText = `Escolha os acompanhamentos e adicionais da sua marmita (R$ ${product.price.toFixed(2).replace('.', ',')})`;
            } else if (presetKey === 'pizzaria') {
                titlePrefix = "Personalize sua";
                subtitleText = `Escolha a borda recheada e adicionais para sua pizza (R$ ${product.price.toFixed(2).replace('.', ',')})`;
            } else if (presetKey === 'burguer') {
                titlePrefix = "Customize seu";
                subtitleText = `Escolha os adicionais, queijos e molhos da casa para o seu lanche (R$ ${product.price.toFixed(2).replace('.', ',')})`;
            } else if (presetKey === 'confeitaria') {
                titlePrefix = "Personalize seu";
                subtitleText = `Escolha os recheios gourmet e coberturas finas (R$ ${product.price.toFixed(2).replace('.', ',')})`;
            } else if (presetKey === 'sorveteria') {
                titlePrefix = "Monte seu";
                subtitleText = `Escolha as coberturas e confeitos do seu sorvete (R$ ${product.price.toFixed(2).replace('.', ',')})`;
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
            
            let html = `
                <div class="customizer-counter-box">
                    <span class="customizer-counter-text">✨ Acompanhamentos Escolhidos:</span>
                    <span class="customizer-counter-badge" id="customizerFreeCount">0/3</span>
                </div>
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

            if (checkbox.checked) {
                selectedIngredients.push({ name, price });
            } else {
                selectedIngredients = selectedIngredients.filter(i => i.name !== name);
            }

            updateCustomizerPrice();
        }

        function updateCustomizerPrice() {
            if (!activeCustomizingProduct) return;

            const freeItems = selectedIngredients.filter(i => i.price === 0);
            const paidItems = selectedIngredients.filter(i => i.price > 0);

            const freeCount = freeItems.length;
            const badgeEl = document.getElementById('customizerFreeCount');
            if (badgeEl) {
                badgeEl.textContent = `${Math.min(freeCount, 3)}/3 Grátis`;
                badgeEl.style.background = freeCount > 3 ? '#DC2626' : '#D97706';
            }

            let paidSum = paidItems.reduce((acc, curr) => acc + curr.price, 0);
            let extraFreeCount = Math.max(0, freeCount - 3);
            let extraFreeSum = extraFreeCount * 2.00; // R$ 2,00 por ingrediente adicional extra

            let total = activeCustomizingProduct.price + paidSum + extraFreeSum;

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
            const extraFreeCount = Math.max(0, freeItems.length - 3);
            const extraFreeSum = extraFreeCount * 2.00;

            const finalUnitPrice = activeCustomizingProduct.price + paidSum + extraFreeSum;

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

            const currentCatalog = getPresetCatalogForActiveCompany();
            const filterLower = filterText.toLowerCase();
            const filtered = currentCatalog.filter(p => 
                p.name.toLowerCase().includes(filterLower) || 
                p.description.toLowerCase().includes(filterLower) ||
                (p.tag && p.tag.toLowerCase().includes(filterLower))
            );

            if (filtered.length === 0) {
                grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--gray-600); font-size: 0.85rem; padding: 1rem;">Nenhum produto encontrado na listagem pronta desta categoria.</p>';
                return;
            }

            grid.innerHTML = filtered.map(item => {
                const alreadyAdded = products.some(p => p.name.toLowerCase().trim() === item.name.toLowerCase().trim());
                return `
                    <div class="preset-card">
                        <div>
                            <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src='acai_300ml.svg';">
                            <div class="preset-card-title">${item.name}</div>
                            <div class="preset-card-desc">${item.description}</div>
                        </div>
                        <div class="preset-card-footer">
                            <span class="preset-card-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                            <button 
                                type="button" 
                                class="btn-add-preset ${alreadyAdded ? 'added' : ''}" 
                                onclick="addPresetToProducts('${item.id}')"
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

        // ========== AUTH & HEADER ADMIN ==========
        let isAdminLoggedIn = false;

        function openAdminLogin() {
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

        function loginAdminSuccess() {
            isAdminLoggedIn = true;
            sessionStorage.setItem('isAdminLoggedIn', 'true');
            const modal = document.getElementById('passwordModal');
            if (modal) modal.classList.remove('active');
            adminPanel.classList.add('active');
            adminOverlay.classList.add('active');
            updateAdminHeaderUI();
            renderPresetCatalog();
            showNotification('Login de empresa realizado com sucesso! 🏬✨', 'success');
        }

        function logoutAdmin() {
            isAdminLoggedIn = false;
            sessionStorage.removeItem('isAdminLoggedIn');
            closeAdminPanel();
            updateAdminHeaderUI();
            updateMobileHeaderMenuUI();
            showNotification('Sessão de empresa encerrada com sucesso.', 'info');
        }

        function updateAdminHeaderUI() {
            const container = document.getElementById('adminHeaderContainer');
            if (container) {
                if (loggedCustomer) {
                    // Quando logado como cliente, não exibir a parte de login de empresa
                    container.innerHTML = '';
                    container.style.display = 'none';
                } else if (isAdminLoggedIn) {
                    container.style.display = 'flex';
                    const activeComp = companies.find(c => c.id === activeCompanyId) || settings;
                    container.innerHTML = `
                        <div class="admin-header-pill-group">
                            <span class="admin-logged-store-badge" title="${activeComp.name || settings.restaurantName}">
                                🏬 <strong>${activeComp.name || settings.restaurantName}</strong>
                            </span>
                            <button class="btn-admin-header-panel" onclick="adminPanel.classList.add('active'); adminOverlay.classList.add('active'); renderPresetCatalog();" title="Abrir Painel Administrativo">
                                ⚙️ Painel
                            </button>
                            <button class="btn-admin-header-logout" onclick="logoutAdmin()" title="Sair da Empresa">
                                🚪 Sair
                            </button>
                        </div>
                    `;
                } else {
                    container.style.display = 'flex';
                    container.innerHTML = `
                        <button class="btn-admin-header-login" onclick="openAdminLogin()" title="Painel de Login da Empresa">
                            🏬 Login Empresa
                        </button>
                    `;
                }
            }
            updateMobileHeaderMenuUI();
        }

        // ========== MANIPULAÇÃO DE IMAGENS E UPLOADS ==========
        function handleLogoUpload(input) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('logoUrl').value = e.target.result;
                    showNotification('Foto da logo carregada!', 'success');
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

        // ========== GERENCIAR PRODUTOS ==========
        function addProduct() {
            editingProductId = null;
            document.getElementById('modalTitle').textContent = 'Adicionar Novo Produto';
            productForm.reset();
            document.getElementById('productAvailable').checked = true;
            document.getElementById('productIsAcai').checked = true;
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
            if (document.getElementById('productIsAcai')) {
                const isEnabled = product.isCustomizable !== undefined ? product.isCustomizable : (product.isAcai !== false);
                document.getElementById('productIsAcai').checked = isEnabled;
            }
            
            const preview = document.getElementById('productImagePreview');
            if (preview) preview.src = product.image;

            productModal.classList.add('active');
        }

        function saveProduct(e) {
            e.preventDefault();
            
            const isCustom = document.getElementById('productIsAcai') ? document.getElementById('productIsAcai').checked : false;

            const productData = {
                id: editingProductId || Date.now(),
                name: document.getElementById('productName').value,
                tag: document.getElementById('productTag') ? document.getElementById('productTag').value : '',
                description: document.getElementById('productDescription').value,
                price: parseFloat(document.getElementById('productPrice').value),
                image: document.getElementById('productImage').value,
                available: document.getElementById('productAvailable').checked,
                isAcai: isCustom,
                isCustomizable: isCustom
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

            // Salvar Seção de Acompanhamentos Customizada (Suporta múltiplos blocos/títulos de categorias)
            const extrasEnabled = document.getElementById('extrasSectionEnabled')?.checked;
            const extrasBadge = document.getElementById('extrasSectionBadge')?.value;
            const extrasTitle = document.getElementById('extrasSectionTitle')?.value;
            const extrasDesc = document.getElementById('extrasSectionDesc')?.value;

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
                categories: cleanCategories
            };

            saveData();
            updateSiteSettings();
            renderDynamicPromoBanner();
            renderDynamicIngredientsSection();
            
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
                        ` : cat.chips.map((chip, chipIdx) => `
                            <div style="display: grid; grid-template-columns: 80px 1fr 100px 34px; gap: 0.35rem; align-items: center; background: #F8FAFC; padding: 0.35rem; border-radius: 6px; border: 1px solid #E2E8F0;">
                                <div style="display: flex; gap: 0.15rem;">
                                    <input type="text" class="form-input" value="${chip.icon || '✨'}" readonly onclick="openIconPickerForExtrasCategoryChip(${catIdx}, ${chipIdx})" style="text-align: center; font-size: 1.05rem; padding: 0.25rem; cursor: pointer; width: 44px;" title="Clique para escolher ícone">
                                    <button type="button" onclick="openIconPickerForExtrasCategoryChip(${catIdx}, ${chipIdx})" title="Escolher Ícone" style="background: #E2E8F0; border: 1px solid #CBD5E1; border-radius: 6px; padding: 0 0.25rem; cursor: pointer; font-size: 0.8rem;">🎨</button>
                                </div>
                                <input type="text" class="form-input" value="${chip.name || ''}" placeholder="Nome do acompanhamento / item" oninput="updateAdminExtrasCategoryChipField(${catIdx}, ${chipIdx}, 'name', this.value)" style="font-size: 0.82rem; padding: 0.3rem;">
                                <input type="text" class="form-input" value="${chip.price || ''}" placeholder="+R$ 2,50" oninput="updateAdminExtrasCategoryChipField(${catIdx}, ${chipIdx}, 'price', this.value)" style="font-size: 0.82rem; padding: 0.3rem;">
                                <button type="button" onclick="removeAdminExtrasChipFromCategory(${catIdx}, ${chipIdx})" title="Remover este item" style="background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; border-radius: 6px; padding: 0.25rem; font-size: 0.82rem; cursor: pointer; text-align: center;">
                                    🗑️
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }

        // ========== GERENCIAMENTO DE CUPONS DE DESCONTO NO ADMIN ==========
        function renderAdminCouponsList() {
            const container = document.getElementById('adminCouponsList');
            if (!container) return;

            const coupons = settings.coupons || [];

            if (coupons.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; color: var(--gray-600); font-size: 0.82rem; padding: 0.75rem; background: var(--gray-50); border: 1px dashed var(--gray-300); border-radius: 8px;">
                        Nenhum cupom cadastrado. Use o formulário acima para criar cupons com % de desconto!
                    </div>
                `;
                return;
            }

            container.innerHTML = coupons.map(c => `
                <div class="coupon-admin-card ${c.active === false ? 'inactive' : ''}">
                    <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                        <span style="font-weight: 800; font-size: 0.88rem; color: var(--primary-dark); letter-spacing: 0.5px;">
                            🏷️ ${c.code}
                        </span>
                        <span style="background: ${c.active !== false ? '#10B981' : '#94A3B8'}; color: white; font-size: 0.72rem; font-weight: 800; padding: 2px 7px; border-radius: 20px;">
                            ${c.discount}% OFF
                        </span>
                        <span style="font-size: 0.75rem; color: ${c.active !== false ? '#059669' : '#64748B'}; font-weight: 600;">
                            ${c.active !== false ? '🟢 Ativo' : '⚪ Inativo'}
                        </span>
                    </div>
                    ${c.description ? `<div style="width: 100%; font-size: 0.76rem; color: var(--gray-600); margin-top: -2px;">${c.description}</div>` : ''}
                    <div style="display: flex; gap: 0.35rem; align-items: center; margin-left: auto;">
                        <button type="button" class="btn-admin" onclick="toggleCouponActive('${c.code}')" style="padding: 0.25rem 0.55rem; font-size: 0.75rem; background: ${c.active !== false ? '#F59E0B' : '#10B981'}; color: white;">
                            ${c.active !== false ? '⏸️ Pausar' : '▶️ Ativar'}
                        </button>
                        <button type="button" onclick="deleteCoupon('${c.code}')" title="Excluir Cupom" style="background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; border-radius: 6px; padding: 0.25rem 0.5rem; font-size: 0.8rem; cursor: pointer;">
                            🗑️
                        </button>
                    </div>
                </div>
            `).join('');
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

            const list = settings.deliveryNeighborhoods || DEFAULT_DELIVERY_NEIGHBORHOODS;

            // Atualizar contadores
            const countAll = list.length;
            const countCentro = list.filter(n => n.zone === 'centro').length;
            const countZonaSul = list.filter(n => n.zone === 'zona_sul').length;
            const countZonaNorte = list.filter(n => n.zone === 'zona_norte').length;
            const countOutros = list.filter(n => n.zone !== 'centro' && n.zone !== 'zona_sul' && n.zone !== 'zona_norte').length;

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
            let filtered = list;
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
                const feeVal = typeof n.fee === 'number' ? n.fee.toFixed(2) : parseFloat(n.fee || 0).toFixed(2);
                const timeVal = n.time || '30 - 45 min';

                return `
                    <div class="neighborhood-item-card ${!isActive ? 'inactive' : ''}" id="card-neighborhood-${n.id}">
                        <div class="neighborhood-info">
                            <div class="neighborhood-name-text">
                                <span>${n.name}</span>
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
                                    onchange="updateNeighborhoodField('${n.id}', 'fee', this.value)"
                                    style="width: 65px;"
                                >
                            </div>

                            <div class="neighborhood-input-wrapper neighborhood-input-time" title="Tempo estimado de entrega para este bairro">
                                <label>⏱️</label>
                                <input 
                                    type="text" 
                                    value="${timeVal}" 
                                    placeholder="30 - 45 min" 
                                    onchange="updateNeighborhoodField('${n.id}', 'time', this.value)"
                                    style="width: 90px;"
                                >
                            </div>

                            <button 
                                type="button" 
                                class="btn-icon btn-toggle" 
                                onclick="toggleNeighborhoodActive('${n.id}')" 
                                title="${isActive ? 'Bairro ativo para entregas (clique para pausar)' : 'Bairro pausado (clique para ativar)'}"
                                style="width: 32px; height: 32px; font-size: 0.9rem;"
                            >
                                ${isActive ? '✅' : '🚫'}
                            </button>

                            <button 
                                type="button" 
                                class="btn-icon btn-delete" 
                                onclick="deleteNeighborhood('${n.id}')" 
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

        // ========== GERENCIAR CARRINHO ==========
        function addToCart(productId) {
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

            if (!code || !code.trim()) {
                showNotification('Digite o código do cupom!', 'warning');
                return;
            }

            code = code.trim().toUpperCase();
            const coupons = settings.coupons || defaultCoupons;
            const found = coupons.find(c => c.code.toUpperCase() === code);

            if (!found) {
                showNotification(`❌ Cupom "${code}" não encontrado!`, 'danger');
                return;
            }

            if (found.active === false) {
                showNotification(`⚠️ O cupom "${code}" está inativo ou pausado!`, 'warning');
                return;
            }

            appliedCoupon = {
                code: found.code,
                discount: found.discount,
                description: found.description || ''
            };

            saveData();
            updateCartUI();

            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const discountVal = (subtotal * appliedCoupon.discount) / 100;
            showNotification(`🎉 Cupom "${found.code}" aplicado! ${found.discount}% de desconto (-R$ ${discountVal.toFixed(2).replace('.', ',')})`, 'success');
        }

        function removeAppliedCoupon() {
            if (!appliedCoupon) return;
            const removedCode = appliedCoupon.code;
            appliedCoupon = null;
            saveData();
            updateCartUI();
            showNotification(`Cupom "${removedCode}" removido.`, 'info');
        }

        function getActiveDeliveryInfo() {
            let fee = typeof settings.deliveryFee === 'number' ? settings.deliveryFee : (parseFloat(settings.deliveryFee) || 5.00);
            let time = settings.deliveryTime || '30 - 45 min';
            let neighborhoodName = '';
            let neighborhoodZone = '';
            let neighborhoodZoneName = '';

            const list = (settings.deliveryNeighborhoods && settings.deliveryNeighborhoods.length > 0) 
                         ? settings.deliveryNeighborhoods 
                         : DEFAULT_DELIVERY_NEIGHBORHOODS;

            // 1. Tentar pegar do select atual no DOM se existir
            const selectEl = document.getElementById('customerNeighborhood');
            let selectedId = selectEl ? selectEl.value : null;

            // 2. Se não tiver no DOM ou se selectEl estiver vazio, tentar pegar dos dados do cliente salvos
            if (!selectedId && customerData && customerData.neighborhoodId) {
                selectedId = customerData.neighborhoodId;
            }

            if (selectedId === 'other') {
                const customInput = document.getElementById('customerCustomNeighborhood');
                neighborhoodName = (customInput && customInput.value.trim()) || (customerData && customerData.neighborhood) || 'Outro Bairro';
                neighborhoodZone = 'outra';
                neighborhoodZoneName = 'Outra Região';
                return { fee, time, neighborhoodName, neighborhoodZone, neighborhoodZoneName, selectedId };
            }

            if (selectedId && selectedId !== 'other') {
                const found = list.find(n => n.id === selectedId || (n.name && n.name.toLowerCase() === selectedId.toLowerCase()));
                if (found) {
                    fee = typeof found.fee === 'number' ? found.fee : (parseFloat(found.fee) || 0);
                    time = found.time || time;
                    neighborhoodName = found.name;
                    neighborhoodZone = found.zone;
                    neighborhoodZoneName = found.zoneName || (found.zone === 'centro' ? 'Centro' : (found.zone === 'zona_sul' ? 'Zona Sul' : (found.zone === 'zona_norte' ? 'Zona Norte' : 'Outra Região')));
                    return { fee, time, neighborhoodName, neighborhoodZone, neighborhoodZoneName, selectedId: found.id };
                }
            }

            // 3. Tentar pelo nome do bairro salvo no customerData
            if (customerData && customerData.neighborhood) {
                const found = list.find(n => (n.name && n.name.toLowerCase() === customerData.neighborhood.toLowerCase()) || n.id === customerData.neighborhoodId);
                if (found) {
                    fee = typeof found.fee === 'number' ? found.fee : (parseFloat(found.fee) || 0);
                    time = found.time || time;
                    neighborhoodName = found.name;
                    neighborhoodZone = found.zone;
                    neighborhoodZoneName = found.zoneName || '';
                    return { fee, time, neighborhoodName, neighborhoodZone, neighborhoodZoneName, selectedId: found.id };
                }
                neighborhoodName = customerData.neighborhood;
            }

            return { fee, time, neighborhoodName, neighborhoodZone, neighborhoodZoneName, selectedId };
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
                    badgeEl.innerHTML = `🛵 Frete: <strong>R$ ${info.fee.toFixed(2).replace('.', ',')}</strong> | ⏱️ Previsão: <strong>${info.time}</strong>`;
                } else {
                    badgeEl.style.display = 'none';
                }
            }

            // Atualiza valores do carrinho sem recriar os campos do formulário
            updateCartUI(false);
        }

        function updateCartUI(forceFormRender = false) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="cart-empty">
                        <div class="cart-empty-icon">🛒</div>
                        <p>Seu carrinho está vazio</p>
                    </div>
                `;
                cartFooter.style.display = 'none';
            } else {
                cartItems.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            ${item.details ? `<div style="font-size: 0.8rem; color: #6B21A8; font-weight: 600; margin-top: 3px; background: #FAF5FF; padding: 4px 8px; border-radius: 6px; border: 1px solid #E9D5FF;">🥣 ${item.details}</div>` : ''}
                            <div class="cart-item-price" style="margin-top: 4px;">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                            <div class="cart-item-controls">
                                <button class="cart-item-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                                <span class="cart-item-quantity">${item.quantity}</span>
                                <button class="cart-item-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">🗑️</button>
                            </div>
                        </div>
                        <div class="cart-item-total">
                            R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </div>
                    </div>
                `).join('');
                
                cartFooter.style.display = 'block';
                renderCustomerForm(forceFormRender);
            }

            // Calcular Desconto do Cupom
            let discountValue = 0;
            if (appliedCoupon && appliedCoupon.discount > 0) {
                const coupons = settings.coupons || [];
                const found = coupons.find(c => c.code.toUpperCase() === appliedCoupon.code.toUpperCase() && c.active !== false);
                if (found) {
                    appliedCoupon.discount = found.discount;
                    discountValue = (subtotal * appliedCoupon.discount) / 100;
                } else {
                    appliedCoupon = null;
                    if (activeCompanyId) localStorage.removeItem(`appliedCoupon_${activeCompanyId}`);
                }
            }

            const discountRow = document.getElementById('cartDiscountRow');
            const discountLabel = document.getElementById('cartDiscountLabel');
            const discountValEl = document.getElementById('cartDiscountValue');

            if (discountRow) {
                if (appliedCoupon && discountValue > 0) {
                    discountRow.style.display = 'flex';
                    if (discountLabel) discountLabel.textContent = `🏷️ Desconto (${appliedCoupon.discount}% - ${appliedCoupon.code}):`;
                    if (discountValEl) discountValEl.textContent = `-R$ ${discountValue.toFixed(2).replace('.', ',')}`;
                } else {
                    discountRow.style.display = 'none';
                }
            }

            // Obter taxa e tempo dinâmico por bairro ou região
            const deliveryInfo = getActiveDeliveryInfo();
            const deliveryFee = deliveryInfo.fee;
            const deliveryTimeText = deliveryInfo.time;
            
            const estTimeEl = document.getElementById('cartEstimatedTime');
            if (estTimeEl) estTimeEl.textContent = deliveryTimeText;

            const finalTotal = Math.max(0, subtotal - discountValue + deliveryFee);

            cartSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
            cartDeliveryFee.textContent = `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`;
            cartTotal.textContent = `R$ ${finalTotal.toFixed(2).replace('.', ',')}`;
            
            renderCartCouponUI(subtotal);
            renderPaymentSelectionUI();
            updateCheckoutButton();
        }

        // ========== AUTENTICAÇÃO E ÁREA DO CLIENTE ==========
        function updateCustomerHeaderUI() {
            const container = document.getElementById('customerHeaderContainer');
            if (container) {
                if (loggedCustomer) {
                    const firstName = loggedCustomer.name ? loggedCustomer.name.trim().split(' ')[0] : 'Cliente';
                    container.innerHTML = `
                        <button class="customer-header-btn" onclick="openCustomerOrdersModal()" title="Ver Meus Pedidos">
                            👤 Olá, ${firstName} | 📦 Pedidos
                        </button>
                    `;
                } else {
                    container.innerHTML = `
                        <button class="customer-header-btn" onclick="openCustomerAuthModal('login')" title="Entrar na Minha Conta">
                            👤 Entrar / Cadastrar
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
                        📦 Meus Pedidos (${firstName})
                    </button>
                    <button type="button" class="mobile-dropdown-item danger-action" onclick="closeMobileHeaderMenu(); logoutCustomer();">
                        🚪 Sair da Conta
                    </button>
                `;
            } else {
                itemsHtml += `
                    <button type="button" class="mobile-dropdown-item primary-action" onclick="closeMobileHeaderMenu(); openCustomerAuthModal('login');">
                        👤 Entrar / Cadastrar
                    </button>
                `;
            }

            // SEÇÃO 2: EMPRESA / GESTÃO (Apenas quando não for cliente autenticado)
            if (!loggedCustomer) {
                itemsHtml += `<div class="mobile-dropdown-divider"></div>`;
                itemsHtml += `<div class="mobile-dropdown-header">Empresa / Painel</div>`;
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
                        <button type="button" class="mobile-dropdown-item admin-action" onclick="closeMobileHeaderMenu(); openAdminLogin();">
                            🏬 Login Empresa
                        </button>
                    `;
                }
            }

            // SEÇÃO 3: FERRAMENTAS & ACESSO
            itemsHtml += `<div class="mobile-dropdown-divider"></div>`;
            itemsHtml += `<div class="mobile-dropdown-header">Recursos & Acesso</div>`;
            itemsHtml += `
                <button type="button" class="mobile-dropdown-item" onclick="closeMobileHeaderMenu(); openQrCodeModal();" style="color: #4F46E5; font-weight: 700;">
                    📱 QR Code & Mesas
                </button>
                <button type="button" class="mobile-dropdown-item" onclick="closeMobileHeaderMenu(); openDevPasswordModal();" style="color: #059669; font-weight: 600;">
                    🛠️ Painel Master / Donfim
                </button>
            `;

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

        function openCustomerAuthModal(tab = 'login') {
            switchAuthTab(tab);
            document.getElementById('customerAuthModal').classList.add('active');
        }

        function closeCustomerAuthModal() {
            document.getElementById('customerAuthModal').classList.remove('active');
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

        function handleCustomerLogin(e) {
            e.preventDefault();
            const phone = document.getElementById('loginPhone').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            const account = customerAccounts.find(acc => acc.phone === phone && acc.password === password);

            if (account) {
                loggedCustomer = account;
                customerData = {
                    name: account.name,
                    neighborhood: account.neighborhood || '',
                    neighborhoodId: account.neighborhoodId || '',
                    neighborhoodZone: account.neighborhoodZone || '',
                    address: account.address,
                    reference: account.reference || '',
                    phone: account.phone
                };
                localStorage.setItem('loggedCustomer', JSON.stringify(loggedCustomer));
                localStorage.setItem('customerData', JSON.stringify(customerData));

                closeCustomerAuthModal();
                renderCustomerForm();
                updateCartUI();
                updateCustomerHeaderUI();
                updateCheckoutButton();
                showNotification(`Bem-vindo(a) de volta, ${account.name}! 👋`, 'success');
            } else {
                showNotification('Telefone ou senha incorretos! Se não possui conta, faça seu cadastro na aba Cadastrar.', 'danger');
            }
        }

        function handleCustomerRegister(e) {
            e.preventDefault();
            const name = document.getElementById('authRegisterName').value.trim();
            const nSelect = document.getElementById('authRegisterNeighborhood');
            const nId = nSelect ? nSelect.value : '';
            const address = document.getElementById('authRegisterAddress').value.trim();
            const reference = document.getElementById('authRegisterReference')?.value.trim() || '';
            const phone = document.getElementById('authRegisterPhone').value.trim();
            const password = document.getElementById('authRegisterPassword').value.trim();

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

            // Logar automaticamente
            loggedCustomer = newAccount;
            customerData = { 
                name, 
                neighborhoodId: nId,
                neighborhood: nName,
                neighborhoodZone: nZoneName || nZone,
                address, 
                reference,
                phone 
            };
            localStorage.setItem('loggedCustomer', JSON.stringify(loggedCustomer));
            localStorage.setItem('customerData', JSON.stringify(customerData));

            closeCustomerAuthModal();
            renderCustomerForm();
            updateCartUI();
            updateCustomerHeaderUI();
            updateCheckoutButton();
            showNotification(`Cadastro realizado com sucesso! Bem-vindo(a), ${name}! ✨`, 'success');
        }

        function logoutCustomer() {
            loggedCustomer = null;
            customerData = null;
            localStorage.removeItem('loggedCustomer');
            localStorage.removeItem('customerData');
            closeCustomerOrdersModal();
            renderCustomerForm(true);
            updateCartUI(false);
            updateCustomerHeaderUI();
            updateCheckoutButton();
            showNotification('Você saiu da sua conta.', 'info');
        }

        // ========== ACOMPANHAMENTO DE PEDIDOS ==========
        function openCustomerOrdersModal() {
            if (!loggedCustomer) {
                openCustomerAuthModal('login');
                return;
            }
            renderCustomerProfileCard();
            renderCustomerOrdersList();
            document.getElementById('customerOrdersModal').classList.add('active');
        }

        function closeCustomerOrdersModal() {
            document.getElementById('customerOrdersModal').classList.remove('active');
        }

        function renderCustomerProfileCard() {
            const container = document.getElementById('customerProfileCardContainer');
            if (!container || !loggedCustomer) return;

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
                        📍 <strong>Endereço de Entrega:</strong> ${loggedCustomer.address}<br>
                        ${loggedCustomer.reference ? `🎯 <strong>Ponto de Referência:</strong> ${loggedCustomer.reference}<br>` : ''}
                        📱 <strong>Telefone:</strong> ${loggedCustomer.phone}
                    </div>
                </div>
            `;
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

            // Coletar todos os pedidos das empresas para o cliente logado/ativo
            let allCustomerOrders = [];
            if (companies && companies.length > 0) {
                companies.forEach(comp => {
                    const compOrders = comp.orders || [];
                    compOrders.forEach(ord => {
                        if (!allCustomerOrders.some(o => o.id === ord.id)) {
                            allCustomerOrders.push(ord);
                        }
                    });
                });
            }
            customerOrders.forEach(ord => {
                if (!allCustomerOrders.some(o => o.id === ord.id)) {
                    allCustomerOrders.push(ord);
                }
            });

            // Filtrar pedidos deste cliente pelo número de telefone
            const phone = (loggedCustomer && loggedCustomer.phone) || (customerData && customerData.phone);
            const myOrders = allCustomerOrders.filter(o => o.customerPhone === phone);

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
                const st = statusLabels[order.status] || statusLabels['RECEIVED'];
                const targetStoreName = order.companyName || settings.restaurantName;
                const targetWhatsapp = order.companyWhatsapp || settings.whatsappNumber;
                const encodedWa = encodeURIComponent(`Olá! Gostaria de acompanhar meu Pedido ${order.id} em ${targetStoreName}.`);
                
                return `
                    <div class="order-card">
                        <div class="order-card-header">
                            <div>
                                <div style="font-size: 0.78rem; font-weight: 800; color: var(--primary); margin-bottom: 2px;">
                                    🏬 ${targetStoreName}
                                </div>
                                <div class="order-id">Pedido ${order.id}</div>
                                <div class="order-date">📅 ${order.date}</div>
                            </div>
                            <span class="order-status-badge ${st.class}">${st.text}</span>
                        </div>
                        ${renderOrderTimeline(order)}
                        <div class="order-items-summary">
                            <strong>Itens Solicitados:</strong>
                            <ul style="margin-top: 4px; padding-left: 1.2rem; font-size: 0.85rem;">
                                ${order.items.map(i => `
                                    <li style="margin-bottom: 3px;">
                                        <strong>${i.quantity}x ${i.name}</strong>
                                        ${i.details ? `<br><small style="color:#6B21A8; font-weight:600;">🥣 ${i.details}</small>` : ''}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        <div class="order-card-footer">
                            <span class="order-total-price">Total: R$ ${order.total.toFixed(2).replace('.', ',')}</span>
                            <a href="https://wa.me/${targetWhatsapp}?text=${encodedWa}" target="_blank" class="btn-track-whatsapp">
                                💬 WhatsApp (${targetStoreName})
                            </a>
                        </div>
                        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.4rem; font-size: 0.78rem;">
                            <span style="background: #FAF5FF; color: #59176B; border: 1px solid #E9D5FF; padding: 0.2rem 0.5rem; border-radius: 6px; font-weight: 700;">💳 ${order.paymentMethod || 'Pix'}</span>
                            <span style="background: #FEF3C7; color: #92400E; border: 1px solid #FCD34D; padding: 0.2rem 0.5rem; border-radius: 6px; font-weight: 700;">⏱️ Previsão: ${order.deliveryTime || '30 - 45 min'}</span>
                            ${(order.couponCode || (order.discountValue && order.discountValue > 0) || (order.discount && order.discount > 0)) ? `<span style="background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; padding: 0.2rem 0.5rem; border-radius: 6px; font-weight: 700;">🏷️ Cupom: ${order.couponCode || 'PROMO'} (-R$ ${(order.discountValue || order.discount || 0).toFixed(2).replace('.', ',')})</span>` : ''}
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

        function renderAdminOrdersList() {
            const container = document.getElementById('adminOrdersList');
            if (!container) return;

            // 1. Filtrar estritamente pedidos pertencentes à empresa ativa
            const activeCompId = activeCompanyId || 'company-fb-default';
            const companyOrdersList = customerOrders.filter(o => 
                o.companyId === activeCompId || 
                (!o.companyId && activeCompId === 'company-fb-default')
            );

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
                    const idMatch = (o.id || '').toLowerCase().includes(q);
                    const nameMatch = (o.customerName || '').toLowerCase().includes(q);
                    const phoneMatch = (o.customerPhone || '').toLowerCase().includes(q);
                    const addrMatch = (o.customerAddress || '').toLowerCase().includes(q);
                    const itemsMatch = (o.items || []).some(i => (i.name || '').toLowerCase().includes(q));
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
                const isExpanded = expandedAdminOrders.has(order.id);
                const st = adminOrderStatusMap[order.status] || adminOrderStatusMap['RECEIVED'];
                const totalItemsCount = (order.items || []).reduce((acc, i) => acc + (i.quantity || 1), 0);
                const encodedWa = encodeURIComponent(`Olá ${order.customerName}! Aqui é da ${settings.restaurantName}, sobre seu pedido ${order.id}.`);
                const cleanPhone = (order.customerPhone || '').replace(/\D/g, '');

                return `
                    <div class="admin-order-compact-card ${isExpanded ? 'expanded' : ''}" id="adminOrderCard_${order.id}">
                        <!-- BARRA RESUMO COMPACTA (CLIQUE PARA EXPANDIR/RECOLHER) -->
                        <div class="admin-order-summary-row" onclick="toggleAdminOrderExpand('${order.id}', event)" title="Clique para ${isExpanded ? 'recolher' : 'ver'} todos os detalhes deste pedido">
                            <!-- ESQUERDA: NÚMERO DO PEDIDO + NOME DO CLIENTE + DATA -->
                            <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; min-width: 220px; flex: 1;">
                                <span style="background: #312E81; color: #FFFFFF; font-weight: 800; font-size: 0.78rem; padding: 3px 8px; border-radius: 6px; font-family: monospace;">
                                    ${order.id}
                                </span>
                                <div>
                                    <div style="font-weight: 800; color: #1E1B4B; font-size: 0.92rem; display: flex; align-items: center; gap: 0.35rem;">
                                        👤 ${order.customerName || 'Cliente'}
                                        ${order.customerPhone ? `<span style="font-size: 0.75rem; color: #64748B; font-weight: normal;">(${order.customerPhone})</span>` : ''}
                                    </div>
                                    <div style="font-size: 0.72rem; color: #64748B; margin-top: 1px;">
                                        📅 ${order.date || 'Hoje'} • 📦 <strong>${totalItemsCount} iten(s)</strong> • 💳 ${order.paymentMethod || 'Pix'}
                                    </div>
                                </div>
                            </div>

                            <!-- DIREITA: VALOR TOTAL + STATUS + AÇÕES RÁPIDAS + CHEVRON -->
                            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;" class="no-toggle">
                                <span style="font-size: 0.95rem; font-weight: 900; color: #047857; background: #ECFDF5; padding: 3px 8px; border-radius: 6px; border: 1px solid #A7F3D0;">
                                    R$ ${order.total.toFixed(2).replace('.', ',')}
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
                                        📍 <strong>Endereço de Entrega:</strong> ${order.customerAddress || 'Endereço não informado'}<br>
                                        ${order.customerReference ? `🎯 <strong style="color: #6D28D9;">Ponto de Referência:</strong> ${order.customerReference}<br>` : ''}
                                        📱 <strong>Telefone:</strong> ${order.customerPhone || 'Sem telefone'} | 
                                        ⏱️ <strong style="color: #D97706;">Previsão:</strong> ${order.deliveryTime || '30 - 45 min'}
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
                                    ${order.items.map(i => `
                                        <li style="margin-bottom: 0.4rem;">
                                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                                <span><strong>${i.quantity}x ${i.name}</strong></span>
                                                ${i.price ? `<span style="font-weight: 700; color: #4338CA;">R$ ${(i.price * (i.quantity || 1)).toFixed(2).replace('.', ',')}</span>` : ''}
                                            </div>
                                            ${i.details ? `<div style="font-size: 0.78rem; color: #6B21A8; margin-top: 1px; font-weight: 600;">🥣 ${i.details}</div>` : ''}
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>

                            <!-- RESUMO FINANCEIRO & BOTÕES DE AÇÃO -->
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.6rem; border-top: 1px dashed #E2E8F0; padding-top: 0.6rem;">
                                <div style="font-size: 0.84rem;">
                                    <div style="font-weight: 800; color: #1E1B4B; font-size: 0.95rem;">
                                        Total: <span style="color: #047857;">R$ ${order.total.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                    ${(order.couponCode || (order.discountValue && order.discountValue > 0) || (order.discount && order.discount > 0)) ? `
                                        <div style="font-size: 0.75rem; color: #059669; font-weight: 700; margin-top: 2px;">
                                            🏷️ Cupom Aplicado: ${order.couponCode || 'PROMO'} (-R$ ${(order.discountValue || order.discount || 0).toFixed(2).replace('.', ',')})
                                        </div>
                                    ` : ''}
                                    <div style="font-size: 0.75rem; color: #64748B; margin-top: 1px;">
                                        Forma de Pagamento: <strong>${order.paymentMethod || 'Pix'}</strong>
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
            const order = customerOrders.find(o => o.id === orderId);
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

        function updateOrderStatus(orderId, newStatus) {
            const order = customerOrders.find(o => o.id === orderId);
            if (!order) return;
            order.status = newStatus;
            saveData();
            renderCustomerOrdersList();
            renderAdminOrdersList();
            showNotification(`Status do pedido ${orderId} atualizado!`, 'success');

            // Sincronizar atualização de status com o servidor da empresa
            const targetCompanyId = activeCompanyId || 'company-fb-default';
            fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-company-id': targetCompanyId
                },
                body: JSON.stringify({ status: newStatus })
            }).catch(err => {
                console.warn('Falha ao sincronizar status do pedido no servidor:', err.message);
            });
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
            customerOrders = customerOrders.filter(o => o.id !== orderId);
            if (knownOrderIds) knownOrderIds.delete(orderId);
            saveData();
            renderCustomerOrdersList();
            renderAdminOrdersList();
            showNotification('Pedido removido do histórico.', 'info');

            // Sincronizar remoção com o servidor da empresa
            const targetCompanyId = activeCompanyId || 'company-fb-default';
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

            const storeName = (settings.restaurantName || 'DON DELIVERY').toUpperCase();
            const storeAddress = (settings.address || '').trim();
            const storeCnpj = (settings.cnpj || '').trim();
            const storeInstagram = (settings.instagram || '@acainaquentinha_do_fb').trim();

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
            const storeName = (settings.restaurantName || 'DON DELIVERY').toUpperCase();
            const storeAddress = (settings.address || '').trim();
            const storeCnpj = (settings.cnpj || '').trim();
            const storeInstagram = (settings.instagram || '@acainaquentinha_do_fb').trim();

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
                order = customerOrders.find(o => o.id === orderId);
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
            if (cart.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }

            if (!customerData) {
                alert('Por favor, preencha seus dados de entrega!');
                return;
            }

            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            // Calcular desconto do cupom aplicado
            let discountValue = 0;
            let finalCouponCode = null;
            let finalCouponDiscount = 0;
            if (appliedCoupon && appliedCoupon.discount > 0) {
                finalCouponCode = appliedCoupon.code;
                finalCouponDiscount = appliedCoupon.discount;
                discountValue = (subtotal * appliedCoupon.discount) / 100;
            }

            const deliveryInfo = getActiveDeliveryInfo();
            const deliveryFee = deliveryInfo.fee;
            const estimatedDeliveryTime = deliveryInfo.time;
            const total = Math.max(0, subtotal - discountValue + deliveryFee);
            const paymentMethodLabel = getFormattedPaymentMethod();

            // Criar registro de pedido para o histórico do cliente e admin
            const activeComp = (companies && companies.find(c => c.id === activeCompanyId)) || settings;
            const currentCompId = activeCompanyId || 'company-fb-default';
            const currentCompName = (activeComp && activeComp.name) || settings.restaurantName || 'Açaí na Quentinha do FB';
            const currentCompWa = (activeComp && activeComp.whatsappNumber) || settings.whatsappNumber;

            const orderId = '#' + Math.floor(1000 + Math.random() * 9000);
            const newOrder = {
                id: orderId,
                companyId: currentCompId,
                companyName: currentCompName,
                companyWhatsapp: currentCompWa,
                customerName: customerData.name,
                customerNeighborhood: customerData.neighborhood || deliveryInfo.neighborhoodName || 'Centro',
                customerNeighborhoodZone: customerData.neighborhoodZone || deliveryInfo.neighborhoodZoneName || '',
                customerAddress: customerData.address,
                customerReference: customerData.reference || '',
                customerPhone: customerData.phone,
                paymentMethod: paymentMethodLabel,
                deliveryTime: estimatedDeliveryTime,
                date: new Date().toLocaleString('pt-BR'),
                couponCode: finalCouponCode,
                couponDiscount: finalCouponDiscount,
                discountValue: discountValue,
                items: cart.map(item => ({
                    name: item.name,
                    details: item.details || '',
                    quantity: item.quantity,
                    price: item.price
                })),
                subtotal: subtotal,
                deliveryFee: deliveryFee,
                total: total,
                status: 'RECEIVED'
            };

            customerOrders.unshift(newOrder);
            if (knownOrderIds) knownOrderIds.add(newOrder.id);
            saveData();

            // Enviar pedido instantaneamente para a API central da empresa
            fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-company-id': currentCompId
                },
                body: JSON.stringify(newOrder)
            }).then(r => r.json()).then(res => {
                if (res && res.success) {
                    console.log('✅ Pedido salvo no servidor com sucesso:', res.data ? res.data.id : newOrder.id);
                }
            }).catch(err => {
                console.warn('ℹ️ Pedido salvo localmente (servidor offline):', err.message);
            });

            // Garantir que a conta esteja registrada
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
                if (!customerAccounts.some(a => a.phone === loggedCustomer.phone)) {
                    customerAccounts.push(loggedCustomer);
                    localStorage.setItem('customerAccounts', JSON.stringify(customerAccounts));
                }
                localStorage.setItem('loggedCustomer', JSON.stringify(loggedCustomer));
                updateCustomerHeaderUI();
            }

            let message = `*💜 Novo Pedido ${orderId} - ${settings.restaurantName}*\n\n`;
            
            // Dados do cliente
            message += `*📋 DADOS DO CLIENTE & ENTREGA*\n`;
            message += `👤 Nome: ${customerData.name}\n`;
            if (newOrder.customerNeighborhood) {
                message += `🛵 Bairro / Região: ${newOrder.customerNeighborhood}${newOrder.customerNeighborhoodZone ? ` (${newOrder.customerNeighborhoodZone})` : ''}\n`;
            }
            message += `📍 Endereço: ${customerData.address}\n`;
            if (customerData.reference) {
                message += `🎯 Ponto de Referência: ${customerData.reference}\n`;
            }
            message += `📱 Telefone: ${customerData.phone}\n\n`;

            // Forma de Pagamento e Previsão de Entrega
            message += `*💳 FORMA DE PAGAMENTO*\n`;
            message += `• ${paymentMethodLabel}\n\n`;

            message += `*⏱️ PREVISÃO DE ENTREGA*\n`;
            message += `• ~${estimatedDeliveryTime}\n\n`;
            
            // Pedido
            message += `*🛒 ITENS DO PEDIDO*\n`;
            cart.forEach(item => {
                message += `• *${item.quantity}x ${item.name}*\n`;
                if (item.details) {
                    message += `   🥣 _Ingredientes: ${item.details}_\n`;
                }
                message += `   Valor unitário: R$ ${item.price.toFixed(2).replace('.', ',')}\n`;
                message += `   Subtotal: R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n\n`;
            });

            message += `------------------------------\n`;
            message += `Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
            if (discountValue > 0 && finalCouponCode) {
                message += `🏷️ *Cupom de Desconto:* ${finalCouponCode} (${finalCouponDiscount}% OFF = -R$ ${discountValue.toFixed(2).replace('.', ',')})\n`;
            }
            message += `Taxa de Entrega: R$ ${deliveryFee.toFixed(2).replace('.', ',')}\n`;
            message += `*💰 TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
            message += 'Aguardo confirmação! Obrigado! 😊';

            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${settings.whatsappNumber}?text=${encodedMessage}`;

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

            showNotification(`Pedido ${orderId} enviado para o WhatsApp! Acompanhe o status na Área do Cliente. 📦`, 'success');
            
            // Auto-imprimir se configurado
            if (printerSettings && printerSettings.autoPrint !== false) {
                setTimeout(() => {
                    triggerPrintOrder(newOrder);
                }, 300);
            }

            // Abrir modal da Área do Cliente para acompanhamento
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
            
            // Admin Panel FAB (se existir)
            const fab = document.getElementById('adminFab');
            if (fab) {
                fab.addEventListener('click', () => {
                    openAdminLogin();
                });
            }
            
            // Password Form (Painel de Login da Empresa com E-mail e Senha)
            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = document.getElementById('companyLoginEmail');
                const enteredEmail = emailInput ? emailInput.value.trim().toLowerCase() : '';
                const enteredPassword = passwordInput.value ? passwordInput.value.trim() : '';

                if (!enteredEmail || !enteredPassword) return;

                // 1. Procurar empresa cadastrada que corresponda ao e-mail e à senha
                let matchedCompany = companies.find(c => {
                    const cEmail = (c.email || '').trim().toLowerCase();
                    const matchEmail = (cEmail === enteredEmail) || (!cEmail && (enteredEmail.includes('fb') || enteredEmail.includes('admin') || c.id === activeCompanyId));
                    const matchPassword = c.adminPassword === enteredPassword;
                    return matchEmail && matchPassword;
                });

                // 2. Se não achou por e-mail exato, verificar se e-mail não estava preenchido e a senha pertence a uma empresa
                if (!matchedCompany) {
                    matchedCompany = companies.find(c => c.adminPassword === enteredPassword);
                    if (matchedCompany) {
                        matchedCompany.email = enteredEmail;
                        saveData();
                    }
                }

                if (matchedCompany) {
                    switchActiveCompany(matchedCompany.id);
                    loginAdminSuccess();
                    if (emailInput) emailInput.value = '';
                    passwordInput.value = '';
                    if (passwordError) passwordError.style.display = 'none';
                } else {
                    if (passwordError) {
                        passwordError.style.display = 'block';
                        passwordError.textContent = '❌ E-mail ou senha incorretos! Por favor, verifique os dados cadastrados.';
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
            
            adminClose.addEventListener('click', closeAdminPanel);
            adminOverlay.addEventListener('click', closeAdminPanel);
            
            document.getElementById('saveSettings').addEventListener('click', saveSettings);
            
            // Product Modal
            addProductBtn.addEventListener('click', addProduct);
            modalClose.addEventListener('click', () => productModal.classList.remove('active'));
            productForm.addEventListener('submit', saveProduct);
            
            // Cart
            cartBtn.addEventListener('click', () => {
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
                const targetKey = `customerOrders_${activeCompanyId || 'company-fb-default'}`;
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
                    title: 'Don Delivery • Plataforma Oficial',
                    url: 'https://dondelivery.site',
                    qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent('https://dondelivery.site')}`,
                    storeName: 'Don Delivery'
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
                const filename = (currentQrScope === 'portal') ? 'qrcode-dondelivery.png' : `qrcode-${(data.storeName || 'loja').toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
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
                            Sem filas • Rápido e Seguro • Don Delivery
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

        // ========== AQUISIÇÃO DO DON DELIVERY ==========
        function openAcquireAppModal() {
            const modal = document.getElementById('acquireAppModal');
            if (modal) modal.classList.add('active');
        }

        function closeAcquireAppModal() {
            const modal = document.getElementById('acquireAppModal');
            if (modal) modal.classList.remove('active');
        }

        // Expor todas as funções globais necessárias para eventos onclick do HTML
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
        window.openCustomerOrdersModal = openCustomerOrdersModal;
        window.closeCustomerOrdersModal = closeCustomerOrdersModal;
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
        window.openDevPanelModal = openDevPanelModal;
        window.closeDevPanelModal = closeDevPanelModal;
        window.openDevPasswordModal = openDevPasswordModal;
        window.closeDevPasswordModal = closeDevPasswordModal;
        window.handleDevPasswordSubmit = handleDevPasswordSubmit;
        window.handleDevCreateCompany = handleDevCreateCompany;
        window.switchActiveCompany = switchActiveCompany;
        window.switchActiveCompanyFromSelect = switchActiveCompanyFromSelect;
        window.handleDevLogoClick = handleDevLogoClick;
        window.syncCurrentCompanyToSupabaseUI = syncCurrentCompanyToSupabaseUI;
        window.downloadSupabaseSQL = downloadSupabaseSQL;
        window.exportHTML = exportHTML;

        // Funções de Autenticação e Impressão
        window.showCustomConfirm = showCustomConfirm;
        window.openCustomConfirm = showCustomConfirm;
        window.closeCustomConfirm = closeCustomConfirm;
        window.togglePasswordVisibility = togglePasswordVisibility;
        window.openAdminLogin = openAdminLogin;
        window.logoutAdmin = logoutAdmin;
        window.openCustomerAuthModal = openCustomerAuthModal;
        window.closeCustomerAuthModal = closeCustomerAuthModal;
        window.switchAuthTab = switchAuthTab;
        window.populateAuthRegisterNeighborhoods = populateAuthRegisterNeighborhoods;
        window.handleAuthRegisterNeighborhoodChange = handleAuthRegisterNeighborhoodChange;
        window.logoutCustomer = logoutCustomer;
        window.toggleMobileHeaderMenu = toggleMobileHeaderMenu;
        window.closeMobileHeaderMenu = closeMobileHeaderMenu;
        window.updateMobileHeaderMenuUI = updateMobileHeaderMenuUI;
        window.openAcaiCustomizer = openAcaiCustomizer;
        window.closeAcaiCustomizer = closeAcaiCustomizer;
        window.confirmAcaiCustomization = confirmAcaiCustomization;
        window.goToPromoSlide = goToPromoSlide;
        window.applyPresetTheme = applyPresetTheme;
        window.connectBluetoothPrinter = connectBluetoothPrinter;
        window.connectUsbSerialPrinter = connectUsbSerialPrinter;
        window.disconnectPrinter = disconnectPrinter;
        window.testPrint58mm = testPrint58mm;

        // Diálogo de Confirmação Seguro
        window.showCustomConfirm = showCustomConfirm;
        window.closeCustomConfirm = closeCustomConfirm;

        // ========== INICIAR APLICAÇÃO ==========
        init();