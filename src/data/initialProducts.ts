import { Product, CustomerShowcaseItem, CardGalleryPhoto, CardPricingMatrix } from '../types';

export const INITIAL_CARD_PRICING: CardPricingMatrix = {
  oneNetwork: 2800,
  twoNetworks: 3200,
  threeNetworks: 3600,
  fourNetworks: 3900,
  customCard: 3500
};

export const INITIAL_CARD_PHOTOS: CardGalleryPhoto[] = [
  {
    id: 'card-photo-insta',
    title: 'Carte NFC — Instagram Pro',
    networkTag: 'instagram',
    imageUrl: '/src/assets/images/tapelix_card_social_1793921692334.jpg',
    description: 'Finition noir mat profond avec liseré violet métallisé et icône Instagram gravée.',
    modelType: 'Noir Mat & Liseré Lilas'
  },
  {
    id: 'card-photo-tiktok',
    title: 'Carte NFC — TikTok Creator',
    networkTag: 'tiktok',
    imageUrl: '/src/assets/images/tapelix_card_social_1793921692334.jpg',
    description: 'Format épuré ultra-réactif pour partage de compte TikTok et vidéos virales.',
    modelType: 'Noir Pur Ébène'
  },
  {
    id: 'card-photo-facebook',
    title: 'Carte NFC — Facebook Business',
    networkTag: 'facebook',
    imageUrl: '/src/assets/images/tapelix_card_social_1793921692334.jpg',
    description: 'Idéal pour lier vos clients en boutique ou restaurant directement à votre page.',
    modelType: 'Noir Mat Satiné'
  },
  {
    id: 'card-photo-whatsapp',
    title: 'Carte NFC — WhatsApp Direct',
    networkTag: 'whatsapp',
    imageUrl: '/src/assets/images/tapelix_card_social_1793921692334.jpg',
    description: 'Ouvre instantanément la discussion WhatsApp sans composer le numéro.',
    modelType: 'Finition Stealth'
  },
  {
    id: 'card-photo-custom',
    title: 'Carte NFC — Custom Marque & Logo',
    networkTag: 'custom',
    imageUrl: '/src/assets/images/hero_tapelix_showcase_1793921691463.jpg',
    description: '100% sur-mesure imprimée ou gravée avec votre logo d’entreprise et charte.',
    modelType: 'Gravure Laser Sur Mesure'
  },
  {
    id: 'card-photo-multi',
    title: 'Carte NFC — Multi-Réseaux Combinés',
    networkTag: 'multi',
    imageUrl: '/src/assets/images/hero_tapelix_showcase_1793921691463.jpg',
    description: 'Combinaison personnalisée (Instagram + TikTok + WhatsApp + Facebook sur une seule puce).',
    modelType: 'Édition Prestige Multi-Connect'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // --- 1. NFC CARDS ---
  {
    id: 'nfc-card-instagram',
    name: 'Instagram NFC Card',
    category: 'nfc-cards',
    subtitle: 'Partagez votre compte Instagram en un geste sans contact',
    description: 'Une carte connectée haut de gamme conçue pour booster votre visibilité sur Instagram. Approchez-la de n’importe quel smartphone moderne pour ouvrir instantanément votre profil ou page.',
    howItWorks: 'Placez la carte à proximité du haut du smartphone (iOS ou Android). La puce NFC intégrée déclenche automatiquement une notification ouvrant directement votre compte Instagram sans aucune application nécessaire.',
    priceDA: 2800,
    image: '/src/assets/images/tapelix_card_social_1793921692334.jpg',
    socialType: 'instagram',
    badge: 'Best-Seller',
    inStock: true,
    features: [
      'Puce NFC NTAG216 haute sensibilité (100 000 lectures)',
      'Revêtement noir mat anti-traces avec bordure violette métallique',
      'Lien modifiable à tout moment',
      'Compatible 100% iPhone et Android sans application',
      'Résistant à l’eau et aux rayures'
    ],
    options: [
      { name: 'Finition', choices: ['Noir Mat & Lilas', 'Noir Pur Ébène', 'Violet Profond Métallique'] },
      { name: 'Gravure au dos', choices: ['Standard TAPELIX', 'Nom ou Pseudo personnalisé (+400 DA)', 'QR Code de secours'] }
    ]
  },
  {
    id: 'nfc-card-tiktok',
    name: 'TikTok NFC Card',
    category: 'nfc-cards',
    subtitle: 'Gagnez des followers et partagez vos vidéos en 1 seconde',
    description: 'Le format idéal pour les créateurs de contenu, influenceurs et marques actives sur TikTok. Permet à vos prospects ou abonnés de rejoindre votre univers TikTok immédiatement.',
    howItWorks: 'En tapant la carte sur un téléphone, le lien profond de votre profil TikTok s’ouvre directement dans l’application TikTok du visiteur.',
    priceDA: 2800,
    image: '/src/assets/images/tapelix_card_social_1793921692334.jpg',
    socialType: 'tiktok',
    badge: 'Tendance',
    inStock: true,
    features: [
      'Ouverture directe du lien TikTok',
      'Design sombre premium aux reflets néons subtils',
      'Puce NFC nouvelle génération ultra-rapide',
      'Garantie à vie sur la puce NFC'
    ],
    options: [
      { name: 'Finition', choices: ['Noir Mat Premium', 'Reflet Violet Tech'] },
      { name: 'Format', choices: ['Standard Carte Bancaire (CR80)', 'Format Slim Luxe'] }
    ]
  },
  {
    id: 'nfc-card-facebook',
    name: 'Facebook NFC Card',
    category: 'nfc-cards',
    subtitle: 'Connectez vos clients à votre page d’entreprise Facebook',
    description: 'Permettez à vos clients physiques en boutique, salon ou événement de liker votre page Facebook, laisser un avis ou rejoindre votre communauté en un éclair.',
    howItWorks: 'Un simple tap amène le visiteur directement sur votre page Facebook ou groupe d’abonnés.',
    priceDA: 2800,
    image: '/src/assets/images/tapelix_card_social_1793921692334.jpg',
    socialType: 'facebook',
    inStock: true,
    features: [
      'Parfait pour les magasins, boutiques et instituts',
      'Finition premium noir violet et blanc lilas',
      'Activation en 2 minutes chrono',
      'Sans abonnement ni frais cachés'
    ],
    options: [
      { name: 'Finition', choices: ['Noir Mat Sobre', 'Violet TAPELIX'] },
      { name: 'Personnalisation', choices: ['Standard avec logo Facebook', 'Avec votre nom d’entreprise'] }
    ]
  },
  {
    id: 'nfc-card-whatsapp',
    name: 'WhatsApp NFC Card',
    category: 'nfc-cards',
    subtitle: 'Déclenchez une discussion WhatsApp sans saisir de numéro',
    description: 'Fini la corvée de dicter son numéro de téléphone ou de l’enregistrer manuellement. Votre interlocuteur approche son smartphone et votre discussion WhatsApp s’ouvre directement.',
    howItWorks: 'La puce NFC programme une redirection instantanée vers votre lien wa.me avec un message d’accueil pré-rempli de votre choix.',
    priceDA: 2800,
    image: '/src/assets/images/tapelix_card_social_1793921692334.jpg',
    socialType: 'whatsapp',
    badge: 'Essentiel Business',
    inStock: true,
    features: [
      'Lancement direct de la messagerie WhatsApp',
      'Message d’accueil automatique pré-configuré possible',
      'Évite les erreurs de saisie de numéro',
      'Idéal pour le commerce et le service client direct'
    ],
    options: [
      { name: 'Finition', choices: ['Noir Mat & Touche Émeraude-Lilas', 'Full Black Sombre'] },
      { name: 'Numéro lié', choices: ['Numéro WhatsApp Standard', 'WhatsApp Business'] }
    ]
  },
  {
    id: 'nfc-card-custom',
    name: 'Custom NFC Card',
    category: 'nfc-cards',
    subtitle: '100% sur-mesure avec votre logo et votre propre identité',
    description: 'La carte signature pour les professionnels, dirigeants et entreprises exigeantes. Nous imprimons ou gravons votre logo, charte graphique et coordonnées complètes.',
    howItWorks: 'Configurée avec votre lien personnalisé (site, arbre de liens, vCard ou réseau social). Livrée prête à l’emploi avec votre charte graphique imprimée en haute définition.',
    priceDA: 3500,
    image: '/src/assets/images/hero_tapelix_showcase_1793921691463.jpg',
    socialType: 'custom',
    badge: 'Sur Mesure',
    inStock: true,
    features: [
      'Impression recto/verso UV Haute Résistance ou gravure laser',
      'Intégration complète de votre logo et couleurs',
      'Multi-redirection possible (portail interactif)',
      'Accompagnement graphique inclus par l’équipe TAPELIX'
    ],
    options: [
      { name: 'Matière', choices: ['PVC Mat Noir Haut de Gamme', 'Métal Brossé Noir (+1500 DA)', 'Bois Sombre Écologique (+800 DA)'] },
      { name: 'Type d’impression', choices: ['Impression Recto/Verso Couleur', 'Gravure Laser Minimaliste'] }
    ]
  },

  // --- 2. NFC KEYCHAINS ---
  {
    id: 'nfc-keychain-instagram',
    name: 'Instagram NFC Keychain',
    category: 'nfc-keychains',
    subtitle: 'Porte-clés connecté compact et ultra-robuste pour Instagram',
    description: 'Toujours à portée de main sur votre trousseau de clés, votre sac ou en déplacement. Présentez votre compte Instagram à tout moment lors de vos rencontres professionnelles ou amicales.',
    howItWorks: 'Faites toucher l’arrière du smartphone avec le porte-clés pour transférer votre profil Instagram en une fraction de seconde.',
    priceDA: 2200,
    image: '/src/assets/images/tapelix_keychain_lux_1793921692525.jpg',
    socialType: 'instagram',
    badge: 'Top Vente',
    inStock: true,
    features: [
      'Boîtier composite renforcé et anneau titanium résistant',
      'Puce NFC scellée étanche IP68',
      'Ultra compact et léger (moins de 15 grammes)',
      'Finitions noir obsidienne et touches violettes'
    ],
    options: [
      { name: 'Coloris anneau', choices: ['Titanium Violet Fumé', 'Noir Mat Stealth'] },
      { name: 'Gravure', choices: ['Logo Instagram', 'Logo TAPELIX'] }
    ]
  },
  {
    id: 'nfc-keychain-tiktok',
    name: 'TikTok NFC Keychain',
    category: 'nfc-keychains',
    subtitle: 'Partagez votre univers TikTok n’importe où et en tout lieu',
    description: 'L’accessoire indispensable pour les créateurs actifs, vloggers et marques dynamiques qui bougent et réseautent au quotidien.',
    howItWorks: 'Le smartphone approche du porte-clés et votre compte TikTok s’affiche automatiquement.',
    priceDA: 2200,
    image: '/src/assets/images/tapelix_keychain_lux_1793921692525.jpg',
    socialType: 'tiktok',
    inStock: true,
    features: [
      'Résistant aux chocs, chutes et intempéries',
      'Puce NFC ultra-sensible',
      'Lien actualisable à distance'
    ],
    options: [
      { name: 'Finition', choices: ['Noir Mat Résine', 'Composite Renforcé'] }
    ]
  },
  {
    id: 'nfc-keychain-whatsapp',
    name: 'WhatsApp NFC Keychain',
    category: 'nfc-keychains',
    subtitle: 'Le contact direct instantané pour commerciaux et artisans',
    description: 'Offrez un moyen ultra-rapide à vos partenaires et clients de vous envoyer un message WhatsApp sans chercher de stylo ni de carte papier.',
    howItWorks: 'Lancement immédiat de la discussion sur WhatsApp avec votre numéro enregistré automatiquement.',
    priceDA: 2200,
    image: '/src/assets/images/tapelix_keychain_lux_1793921692525.jpg',
    socialType: 'whatsapp',
    badge: 'Pratique',
    inStock: true,
    features: [
      'Évite la perte des cartes de visite physiques',
      'Format robuste pour trousseau de clés voiture ou pro',
      'Lecture immédiate sans application requise'
    ],
    options: [
      { name: 'Style', choices: ['Noir Minimaliste', 'Noir Violet TAPELIX'] },
      { name: 'Attache', choices: ['Anneau Rond Titanium', 'Mousqueton Métal Rapide'] }
    ]
  },

  // --- 3. NFC TABLE STANDS ---
  {
    id: 'nfc-table-stand-classic',
    name: 'NFC Table Stand',
    category: 'nfc-table-stands',
    subtitle: 'Chevalet de table sans contact pour comptoirs et tables',
    description: 'Le support idéal pour restaurants, cafés, salons de coiffure, hôtels et boutiques. Posé sur une table ou au comptoir de caisse, il permet aux clients de poser leur téléphone pour se connecter.',
    howItWorks: 'Le client approche simplement son smartphone du haut du support. L’interaction sans contact se fait en un instant.',
    priceDA: 4200,
    image: '/src/assets/images/tapelix_table_stand_1793921693255.jpg',
    badge: 'Pro Restauration',
    inStock: true,
    features: [
      'Base lourde stable anti-basculement',
      'Acrylique noir satiné et bandeau rétro-luminescent passif',
      'Puce NFC double portée industrielle',
      'Nettoyage facile aux produits désinfectants'
    ],
    options: [
      { name: 'Dimensions', choices: ['Format Moyen (10x15 cm)', 'Grand Format Comptoir (15x20 cm)'] },
      { name: 'Finition du socle', choices: ['Socle Noir Mat Lesté', 'Socle Bois Sombre Ébène'] }
    ]
  },
  {
    id: 'nfc-table-stand-qr',
    name: 'NFC + QR Code Stand',
    category: 'nfc-table-stands',
    subtitle: 'Double technologie : Tap NFC ou Scan QR haute précision',
    description: 'La solution la plus universelle du marché algérien : les clients équipés du NFC posent leur téléphone, et ceux qui préfèrent scanner utilisent le QR code haute lisibilité intégré.',
    howItWorks: 'Double technologie : tap sans contact sur la puce NFC ou scan rapide de l’appareil photo sur le QR Code gravé.',
    priceDA: 4800,
    image: '/src/assets/images/tapelix_table_stand_1793921693255.jpg',
    badge: '100% Universel',
    inStock: true,
    features: [
      'Garantit 100% de compatibilité quel que soit le modèle de smartphone',
      'QR Code dynamique haute netteté non dégradable',
      'Puce NFC industrielle scellée',
      'Impression haute résistance aux UV et projections de liquides'
    ],
    options: [
      { name: 'Orientation', choices: ['Vertical (Portrait)', 'Horizontal (Paysage)'] },
      { name: 'Contenu affiché', choices: ['Menu Restaurant & WiFi', 'Avis Google & Instagram', 'Catalogue Produits & Contact'] }
    ]
  },
  {
    id: 'nfc-table-stand-custom',
    name: 'Custom NFC Stand',
    category: 'nfc-table-stands',
    subtitle: 'Chevalet de table sur-mesure aux couleurs de votre établissement',
    description: 'Créé spécialement avec votre logo gravé, votre palette de couleurs et la disposition de votre choix. Mettez en valeur le standing de votre hôtel, restaurant gastronomique ou boutique de luxe.',
    howItWorks: 'Fabriqué à vos mesures et configuré avec les services numériques de votre établissement (menu, avis, wifi, programme de fidélité).',
    priceDA: 5500,
    image: '/src/assets/images/tapelix_table_stand_1793921693255.jpg',
    badge: 'Luxe & Hôtellerie',
    inStock: true,
    features: [
      'Design exclusif validé sur maquette 3D avant production',
      'Matériaux premium : acrylique sablé, aluminium ou bois massif',
      'Programmation NFC sur mesure avec statistiques de scans',
      'Remise quantitative disponible pour équipement complet de salles'
    ],
    options: [
      { name: 'Matériaux', choices: ['Acrylique Noir Satiné & Inox', 'Bois Massif & Métal Gravé (+1200 DA)'] },
      { name: 'Quantité salle', choices: ['Unité (1 pièce)', 'Pack 5 tables (-10%)', 'Pack 10 tables (-20%)'] }
    ]
  },

  // --- 4. DIGITAL MENU ---
  {
    id: 'digital-menu-qr',
    name: 'QR Code Menu',
    category: 'digital-menu',
    subtitle: 'Menu numérique fluide, sans contact et sans réimpression',
    description: 'Dites adieu aux menus papier sales, abîmés ou obsolètes. Offrez à vos clients un menu en ligne moderne, rapide à charger sur smartphone, avec photos et prix toujours à jour.',
    howItWorks: 'Le client scanne le QR code placé sur la table et consulte instantanément votre carte mise en page avec clarté et élégance.',
    priceDA: 8500,
    image: '/src/assets/images/tapelix_digital_menu_1793921695711.jpg',
    isService: true,
    badge: 'Économique & Pro',
    inStock: true,
    features: [
      'Interface ultra-rapide optimisée pour mobile',
      'Photos de plats en haute définition et descriptions',
      'Catégories claires (Entrées, Plats, Desserts, Boissons)',
      'Modification instantanée des prix et disponibilités des plats',
      'Hébergement sécurisé 1 an inclus'
    ],
    options: [
      { name: 'Langues du menu', choices: ['Français & Arabe', 'Français uniquement', 'Français, Arabe & Anglais (+2000 DA)'] },
      { name: 'Nombre d’articles', choices: ['Jusqu’à 40 plats', 'Jusqu’à 100 plats (+3000 DA)', 'Illimité (+6000 DA)'] }
    ]
  },
  {
    id: 'digital-menu-nfc-qr',
    name: 'NFC + QR Code Menu',
    category: 'digital-menu',
    subtitle: 'La formule complète combinant chevalets physiques et menu en ligne',
    description: 'Le pack tout-en-un pour les restaurateurs : nous créons votre menu digital personnalisé et vous fournissons les supports de table NFC + QR Code assortis.',
    howItWorks: 'Les clients posent leur téléphone ou scannent le QR code pour accéder à votre carte interactive en une demi-seconde.',
    priceDA: 15000,
    image: '/src/assets/images/tapelix_digital_menu_1793921695711.jpg',
    isService: true,
    badge: 'Pack Complet Resto',
    inStock: true,
    features: [
      'Création graphique et intégration complète de votre menu',
      '5 à 10 supports de table NFC + QR Code inclus et configurés',
      'Tableau de bord pour modifier plats et prix en autonomie',
      'QR Code spécial comptoir et vitrine inclus'
    ],
    options: [
      { name: 'Supports inclus', choices: ['5 Chevalets de table inclus', '10 Chevalets de table inclus (+4500 DA)', '20 Chevalets de table inclus (+8500 DA)'] },
      { name: 'Personnalisation charte', choices: ['Charte Standard Sombre TAPELIX', 'Design sur-mesure aux couleurs du restaurant'] }
    ]
  },
  {
    id: 'digital-menu-interactive',
    name: 'Interactive Digital Menu',
    category: 'digital-menu',
    subtitle: 'Menu interactif avec filtres d’ingrédients et commande directe',
    description: 'Une véritable expérience gastronomique interactive. Vos clients peuvent filtrer par régimes alimentaires, consulter les allergènes, voir les suggestions du chef et transmettre leur sélection.',
    howItWorks: 'Une web-application élégante et responsive connectée directement aux terminaux de commande ou au service de salle.',
    priceDA: 24000,
    image: '/src/assets/images/tapelix_digital_menu_1793921695711.jpg',
    isService: true,
    badge: 'Expérience Ultime',
    inStock: true,
    features: [
      'Filtres avancés : Plats végétariens, sans gluten, spécialités du chef',
      'Recommandations automatiques d’accompagnements et boissons',
      'Option de transmission de commande ou appel serveur',
      'Statistiques sur les plats les plus consultés'
    ],
    options: [
      { name: 'Fonctionnalité commande', choices: ['Consultation seule enrichie', 'Avec pré-commande WhatsApp de table (+5000 DA)'] },
      { name: 'Maintenance', choices: ['6 mois de mises à jour inclus', '1 an de maintenance VIP (+8000 DA)'] }
    ]
  },

  // --- 5. DIGITAL CARDS ---
  {
    id: 'digital-business-card',
    name: 'Digital Business Card',
    category: 'digital-cards',
    subtitle: 'Votre carte de visite digitale avec sauvegarde de contact en 1 clic',
    description: 'Votre profil professionnel vCard moderne. Vos interlocuteurs peuvent enregistrer instantanément votre numéro, email, fonction, adresse et site directement dans leur répertoire sans rien taper.',
    howItWorks: 'Le smartphone scanne ou tape votre carte, une page épurée s’ouvre avec un bouton « Enregistrer le contact » qui télécharge directement votre fiche complète dans le carnet d’adresses.',
    priceDA: 3900,
    image: '/src/assets/images/tapelix_digital_card_1793921696646.jpg',
    badge: 'Indispensable Pro',
    inStock: true,
    features: [
      'Bouton universel « Enregistrer dans les contacts » (vCard .vcf)',
      'Photo de profil ou logo d’entreprise',
      'Coordonnées téléphoniques, email et localisation',
      'Liens directs vers tous vos réseaux professionnels (LinkedIn, etc.)'
    ],
    options: [
      { name: 'Support physique', choices: ['Carte NFC TAPELIX incluse', 'Profil Digital uniquement (-1000 DA)'] },
      { name: 'Style graphique', choices: ['Noir Obsidienne & Lilas', 'Élégance Minimaliste Dark'] }
    ]
  },
  {
    id: 'professional-digital-profile',
    name: 'Professional Digital Profile',
    category: 'digital-cards',
    subtitle: 'Mini-site personnel avec portfolio, liens, bio et prise de rendez-vous',
    description: 'Bien plus qu’une simple carte de visite : un véritable mini-site vitrine personnel conçu pour consultants, médecins, avocats, architectes, agents immobiliers et entrepreneurs.',
    howItWorks: 'Une page web personnelle hébergée avec votre nom de domaine ou sous-domaine tapelix.dz/votre-nom, optimisée pour le référencement et la conversion.',
    priceDA: 6900,
    image: '/src/assets/images/tapelix_digital_card_1793921696646.jpg',
    isService: true,
    badge: 'Cadres & Dirigeants',
    inStock: true,
    features: [
      'Présentation de votre biographie, parcours et réalisations',
      'Intégration d’un lien Calendly ou WhatsApp pour prise de RDV',
      'Téléchargement de brochure de présentation ou CV en PDF',
      'Design responsive haute couture'
    ],
    options: [
      { name: 'Hébergement', choices: ['Sous-domaine tapelix.dz inclus', 'Nom de domaine propre .dz ou .com (+3500 DA)'] },
      { name: 'Section Portfolio', choices: ['Standard (3 réalisations)', 'Étendu (jusqu’à 10 projets)'] }
    ]
  },
  {
    id: 'contact-qr-code',
    name: 'Contact QR Code',
    category: 'digital-cards',
    subtitle: 'QR Code vectoriel intelligent pour supports imprimés et signatures',
    description: 'Un QR code haute définition personnalisé avec votre logo et vos couleurs, redirigeant vers votre profil digital sécurisé. Prêt pour l’impression sur vos véhicules, vitrines, flyers ou signatures email.',
    howItWorks: 'Fichiers vectoriels livrés en formats haute définition (SVG, EPS, PNG transparent 4000x4000px) garantissant une netteté irréprochable à toute échelle.',
    priceDA: 2500,
    image: '/src/assets/images/tapelix_digital_card_1793921696646.jpg',
    isService: true,
    inStock: true,
    features: [
      'Fichiers vectoriels exploitables par tout imprimeur',
      'QR Code dynamique modifiable sans devoir réimprimer',
      'Intégration du logo TAPELIX ou de votre propre marque',
      'Livraison sous 24h par email ou WhatsApp'
    ],
    options: [
      { name: 'Format de livraison', choices: ['Pack Vectoriel Complet (SVG, PDF, PNG)', 'Pack Web & Print HD'] }
    ]
  },

  // --- 6. CREATIVE DESIGN ---
  {
    id: 'service-logo-design',
    name: 'Logo Design',
    category: 'creative-design',
    subtitle: 'Création de logo mémorable, intemporel et vectoriel',
    description: 'Donnez à votre marque une identité visuelle forte et professionnelle. Nos designers conçoivent un symbole et une typographie sur-mesure qui marquent les esprits.',
    howItWorks: 'Briefing initial via WhatsApp ou appel, présentation de 3 pistes graphiques distinctes, ajustements illimités jusqu’à validation, puis livraison du pack vectoriel complet.',
    priceDA: 18000,
    image: '/assets/aistudio/5D413423-3405-455F-9A5E-69BCA64D9200_b5fd4a93.png',
    isService: true,
    badge: 'Identité de Marque',
    inStock: true,
    features: [
      '3 propositions graphiques originales et distinctes',
      'Révisions et ajustements inclus jusqu’à satisfaction',
      'Fichiers finaux vectoriels (AI, EPS, SVG, PNG transparent)',
      'Déclinaisons fond clair, fond sombre et monochrome'
    ],
    options: [
      { name: 'Formule', choices: ['Pack Logo Essentiel (3 pistes)', 'Pack Logo & Mini Charte (+7000 DA)'] }
    ]
  },
  {
    id: 'service-instagram-design',
    name: 'Instagram Design',
    category: 'creative-design',
    subtitle: 'Pack de templates visuels cohérents et percutants pour vos réseaux',
    description: 'Harmonisez votre feed Instagram avec des gabarits professionnels conçus pour valoriser vos produits, vos annonces, témoignages et promotions.',
    howItWorks: 'Création de modèles Canva ou Photoshop modifiables facilement par votre équipe pour publier du contenu propre tous les jours.',
    priceDA: 12000,
    image: '/assets/aistudio/5D413423-3405-455F-9A5E-69BCA64D9200_b5fd4a93.png',
    isService: true,
    inStock: true,
    features: [
      '6 à 12 templates de posts carrés ou portraits (4:5)',
      '6 couvertures de Stories à la une (Highlights) personnalisées',
      '3 gabarits de Stories animées',
      'Prise en main guidée sur Canva'
    ],
    options: [
      { name: 'Nombre de templates', choices: ['Pack Découverte (6 templates)', 'Pack Pro (12 templates + 6 stories)'] }
    ]
  },
  {
    id: 'service-flyer-design',
    name: 'Flyer Design',
    category: 'creative-design',
    subtitle: 'Conception de flyers et affiches publicitaires à fort impact',
    description: 'Idéal pour le lancement d’un produit, une ouverture de restaurant, une offre promotionnelle ou un événement spécial en Algérie.',
    howItWorks: 'Mise en page percutante avec hiérarchie claire des informations, visuels soignés et préparation technique pour l’imprimeur (bords perdus, CMJN).',
    priceDA: 8000,
    image: '/assets/aistudio/5D413423-3405-455F-9A5E-69BCA64D9200_b5fd4a93.png',
    isService: true,
    inStock: true,
    features: [
      'Format A5, A6 ou format personnalisé',
      'Recto seul ou Recto/Verso',
      'Fichiers PDF certifiés impression HD 300 DPI avec traits de coupe',
      'Version optimisée pour le partage WhatsApp et réseaux'
    ],
    options: [
      { name: 'Faces', choices: ['Recto Seul', 'Recto / Verso (+3000 DA)'] }
    ]
  },
  {
    id: 'service-business-card-design',
    name: 'Business Card Design',
    category: 'creative-design',
    subtitle: 'Design graphique d’exception pour cartes physiques et NFC',
    description: 'La création graphique sur-mesure de votre carte de visite. Nous adaptons la composition au format standard carte bancaire ou aux spécifications des cartes NFC TAPELIX.',
    howItWorks: 'Conception personnalisée respectant scrupuleusement votre secteur d’activité et votre positionnement premium.',
    priceDA: 6000,
    image: '/assets/aistudio/5D413423-3405-455F-9A5E-69BCA64D9200_b5fd4a93.png',
    isService: true,
    inStock: true,
    features: [
      '2 concepts créatifs uniques',
      'Préparation aux vernis sélectifs, dorures ou gaufrages',
      'Intégration optimale de la zone puce NFC et QR Code',
      'Prêt pour impression immédiate'
    ],
    options: [
      { name: 'Format', choices: ['Adapté aux cartes NFC TAPELIX', 'Format Impression Traditionnelle'] }
    ]
  },
  {
    id: 'service-visual-identity',
    name: 'Visual Identity',
    category: 'creative-design',
    subtitle: 'Charte graphique globale complète pour structurer votre marque',
    description: 'La solution complète pour les nouvelles entreprises et marques en refonte. Nous définissons l’ensemble des règles visuelles assurant la cohérence de votre communication.',
    howItWorks: 'Élaboration d’un Brand Book complet comprenant règles d’usage du logo, typographies institutionnelles, palette chromatique et applications sur supports variés.',
    priceDA: 35000,
    image: '/assets/aistudio/5D413423-3405-455F-9A5E-69BCA64D9200_b5fd4a93.png',
    isService: true,
    badge: 'Prestige Marque',
    inStock: true,
    features: [
      'Logo principal, logos secondaires et monogrammes',
      'Palette chromatique officielle (HEX, RGB, CMJN, Pantone)',
      'Sélection et hiérarchie typographique',
      'Guide d’utilisation de la marque (Brand Book PDF complet)',
      'Déclinaisons sur papeterie et réseaux sociaux'
    ],
    options: [
      { name: 'Périmètre', choices: ['Charte Standard Brand Book', 'Charte Complète avec Papeterie Pro (+10000 DA)'] }
    ]
  }
];

export const CATEGORY_DEFINITIONS = [
  {
    id: 'nfc-cards' as const,
    title: 'Cartes NFC',
    subtitle: 'Instagram, TikTok, WhatsApp & sur-mesure',
    anchor: 'nfc-cards',
    image: '/src/assets/images/tapelix_card_social_1793921692334.jpg',
    countText: 'Carrousel & Configurateur'
  },
  {
    id: 'nfc-keychains' as const,
    title: 'NFC Keychains',
    subtitle: 'Porte-clés connectés durables',
    anchor: 'nfc-keychains',
    image: '/src/assets/images/tapelix_keychain_lux_1793921692525.jpg',
    countText: '3 modèles'
  },
  {
    id: 'nfc-table-stands' as const,
    title: 'NFC Table Stands',
    subtitle: 'Pour restaurants, cafés & hôtels',
    anchor: 'nfc-table-stands',
    image: '/src/assets/images/tapelix_table_stand_1793921693255.jpg',
    countText: '3 solutions pros'
  },
  {
    id: 'digital-menu' as const,
    title: 'Digital Menu',
    subtitle: 'Menus en ligne interactifs sans contact',
    anchor: 'digital-menu',
    image: '/src/assets/images/tapelix_digital_menu_1793921695711.jpg',
    countText: '3 formules'
  },
  {
    id: 'digital-cards' as const,
    title: 'Digital Cards',
    subtitle: 'Profil vCard & contact universel',
    anchor: 'digital-cards',
    image: '/src/assets/images/tapelix_digital_card_1793921696646.jpg',
    countText: '3 solutions'
  },
  {
    id: 'creative-design' as const,
    title: 'Creative Design',
    subtitle: 'Identité visuelle, logos & flyers',
    anchor: 'creative-design',
    image: '/assets/aistudio/5D413423-3405-455F-9A5E-69BCA64D9200_b5fd4a93.png',
    countText: '5 services'
  }
];

export const INITIAL_CUSTOMER_SHOWCASE: CustomerShowcaseItem[] = [
  {
    id: 'showcase-1',
    title: 'Emplacement Réalisation Client #1',
    category: 'NFC Card personnalisée',
    clientType: 'Boutique & Retail à Alger',
    imageUrl: '/src/assets/images/tapelix_card_social_1793921692334.jpg',
    dateAdded: '2026'
  },
  {
    id: 'showcase-2',
    title: 'Emplacement Réalisation Client #2',
    category: 'Chevalet de table NFC/QR',
    clientType: 'Restaurant & Lounge à Oran',
    imageUrl: '/src/assets/images/tapelix_table_stand_1793921693255.jpg',
    dateAdded: '2026'
  },
  {
    id: 'showcase-3',
    title: 'Emplacement Réalisation Client #3',
    category: 'Porte-clés connecté',
    clientType: 'Agence Immobilière & Véhicules',
    imageUrl: '/src/assets/images/tapelix_keychain_lux_1793921692525.jpg',
    dateAdded: '2026'
  },
  {
    id: 'showcase-4',
    title: 'Emplacement Réalisation Client #4',
    category: 'Menu digital & Carte NFC',
    clientType: 'Coffee Shop & Salon de thé',
    imageUrl: '/src/assets/images/tapelix_digital_menu_1793921695711.jpg',
    dateAdded: '2026'
  }
];
