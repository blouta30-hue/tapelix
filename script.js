/**
 * TAPELIX — SCRIPT OFFICIEL (VANILLA JAVASCRIPT PUR)
 * 100% autonome, zéro dépendance, fonctionne directement en double-cliquant index.html ou toute page.
 * Numéro officiel WhatsApp : 0782308820 (Algérie +213782308820)
 */

(function () {
  'use strict';

  // --- 1. DONNÉES DU CATALOGUE ---
  const DEFAULT_CARD_PRICING = {
    oneNetwork: 2800,
    twoNetworks: 3200,
    threeNetworks: 3600,
    fourNetworks: 3900,
    customExtra: 400
  };

  const DEFAULT_CARD_PHOTOS = [
    {
      id: 'card-insta',
      title: 'Carte NFC — Instagram Pro',
      tag: 'instagram',
      image: './images/card-social.jpg',
      model: 'Noir Mat & Liseré Lilas',
      desc: 'Finition noir mat profond avec liseré violet métallisé et icône Instagram gravée.'
    },
    {
      id: 'card-tiktok',
      title: 'Carte NFC — TikTok Creator',
      tag: 'tiktok',
      image: './images/card-social.jpg',
      model: 'Noir Pur Ébène',
      desc: 'Format ultra-réactif pour partage instantané de compte TikTok et vidéos virales.'
    },
    {
      id: 'card-facebook',
      title: 'Carte NFC — Facebook Business',
      tag: 'facebook',
      image: './images/card-social.jpg',
      model: 'Noir Mat Satiné',
      desc: 'Liez vos clients en boutique ou restaurant directement à votre page ou groupe.'
    },
    {
      id: 'card-whatsapp',
      title: 'Carte NFC — WhatsApp Direct',
      tag: 'whatsapp',
      image: './images/card-social.jpg',
      model: 'Finition Stealth',
      desc: 'Ouvre instantanément la discussion WhatsApp sans devoir enregistrer le numéro.'
    },
    {
      id: 'card-custom',
      title: 'Carte NFC — Custom Logo & Entreprise',
      tag: 'custom',
      image: './images/hero-showcase.jpg',
      model: 'Sur Mesure',
      desc: '100% personnalisée avec l’identité visuelle et le logo de votre entreprise.'
    }
  ];

  // --- 2. GESTION DU STOCKAGE LOCAL SÉCURISÉ ---
  function getStorage(key, fallback) {
    try {
      if (typeof localStorage === 'undefined') return fallback;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function setStorage(key, val) {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  const cardPricing = getStorage('tapelix_pricing', DEFAULT_CARD_PRICING);
  const cardPhotos = getStorage('tapelix_photos', DEFAULT_CARD_PHOTOS);
  const cart = getStorage('tapelix_cart', []);

  // --- 3. ÉTAT DU CONFIGURATEUR DE CARTE ---
  const configState = {
    selectedNetworks: ['instagram'],
    model: 'Noir Mat & Liseré Lilas',
    customization: 'Standard TAPELIX',
    customExtra: 0,
    quantity: 1,
    handles: {
      instagram: '',
      tiktok: '',
      facebook: '',
      whatsapp: ''
    }
  };

  // --- 4. GESTION DU CONFIGURATEUR ---
  function setupConfigurator() {
    const networkButtons = document.querySelectorAll('.network-pill-btn');
    networkButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const net = btn.getAttribute('data-network');
        if (net) toggleNetwork(net);
      });
    });

    const modelButtons = document.querySelectorAll('.model-opt-btn');
    modelButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        modelButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        configState.model = btn.getAttribute('data-model') || btn.innerText;
        updateConfigSummary();
      });
    });

    const customSelect = document.getElementById('configCustomSelect');
    if (customSelect) {
      customSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        const engravedInput = document.getElementById('engravedTextInput');
        if (val === 'engraving') {
          configState.customization = 'Nom/Pseudo gravé au dos';
          configState.customExtra = cardPricing.customExtra || 400;
          if (engravedInput) engravedInput.style.display = 'block';
        } else {
          configState.customization = 'Standard TAPELIX';
          configState.customExtra = 0;
          if (engravedInput) engravedInput.style.display = 'none';
        }
        updateConfigSummary();
      });
    }

    const qtyMinus = document.getElementById('cfgQtyMinus');
    const qtyPlus = document.getElementById('cfgQtyPlus');
    const qtyVal = document.getElementById('cfgQtyVal');
    if (qtyMinus && qtyPlus) {
      qtyMinus.addEventListener('click', () => {
        if (configState.quantity > 1) {
          configState.quantity--;
          if (qtyVal) qtyVal.innerText = configState.quantity;
          updateConfigSummary();
        }
      });
      qtyPlus.addEventListener('click', () => {
        configState.quantity++;
        if (qtyVal) qtyVal.innerText = configState.quantity;
        updateConfigSummary();
      });
    }

    const btnCfgCart = document.getElementById('btnConfigAddToCart');
    if (btnCfgCart) {
      btnCfgCart.addEventListener('click', () => {
        addConfiguredCardToCart();
        closeModal('cardConfigModal');
        openCartDrawer();
      });
    }

    const btnCfgWA = document.getElementById('btnConfigWhatsApp');
    if (btnCfgWA) {
      btnCfgWA.addEventListener('click', () => {
        const item = buildConfiguredItem();
        openWhatsAppOrder([item]);
        closeModal('cardConfigModal');
      });
    }
  }

  function toggleNetwork(net) {
    const idx = configState.selectedNetworks.indexOf(net);
    if (idx > -1) {
      if (configState.selectedNetworks.length > 1) {
        configState.selectedNetworks.splice(idx, 1);
      }
    } else {
      configState.selectedNetworks.push(net);
    }
    renderNetworkButtonsState();
    updateConfigSummary();
  }

  function renderNetworkButtonsState() {
    const buttons = document.querySelectorAll('.network-pill-btn');
    buttons.forEach((btn) => {
      const net = btn.getAttribute('data-network');
      if (configState.selectedNetworks.includes(net)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const handleRows = document.querySelectorAll('.net-handle-row');
    handleRows.forEach((row) => {
      const net = row.getAttribute('data-network');
      if (configState.selectedNetworks.includes(net)) {
        row.style.display = 'flex';
      } else {
        row.style.display = 'none';
      }
    });
  }

  function getCardUnitPrice() {
    const count = configState.selectedNetworks.length;
    let base = cardPricing.oneNetwork;
    if (count === 2) base = cardPricing.twoNetworks;
    else if (count === 3) base = cardPricing.threeNetworks;
    else if (count >= 4) base = cardPricing.fourNetworks;

    return base + (configState.customExtra || 0);
  }

  function updateConfigSummary() {
    const labels = configState.selectedNetworks.map((n) => n.charAt(0).toUpperCase() + n.slice(1));
    const dynamicName = 'Carte NFC — ' + labels.join(' + ');

    const titleEl = document.getElementById('cfgDynamicTitle');
    if (titleEl) titleEl.innerText = dynamicName;

    const netEl = document.getElementById('cfgRecapNetworks');
    if (netEl) netEl.innerText = labels.join(', ');

    const modelEl = document.getElementById('cfgRecapModel');
    if (modelEl) modelEl.innerText = configState.model;

    const qtyEl = document.getElementById('cfgRecapQty');
    if (qtyEl) qtyEl.innerText = configState.quantity;

    const unit = getCardUnitPrice();
    const total = unit * configState.quantity;

    const unitEl = document.getElementById('cfgRecapUnit');
    if (unitEl) unitEl.innerText = unit.toLocaleString('fr-DZ') + ' DA';

    const totalEl = document.getElementById('cfgRecapTotal');
    if (totalEl) totalEl.innerText = total.toLocaleString('fr-DZ') + ' DA';
  }

  function buildConfiguredItem() {
    const labels = configState.selectedNetworks.map((n) => n.charAt(0).toUpperCase() + n.slice(1));
    const unit = getCardUnitPrice();
    const engInput = document.getElementById('engravedTextInput');
    const engText = engInput ? engInput.value.trim() : '';

    return {
      id: 'nfc-card-' + Date.now(),
      name: 'Carte NFC — ' + labels.join(' + '),
      model: configState.model,
      networks: labels.join(' + '),
      customization: configState.customization + (engText ? ' (' + engText + ')' : ''),
      priceDA: unit,
      quantity: configState.quantity,
      image: './images/card-social.jpg'
    };
  }

  function addConfiguredCardToCart() {
    const item = buildConfiguredItem();
    cart.push(item);
    setStorage('tapelix_cart', cart);
    renderCart();
  }

  // --- 5. GESTION DU PANIER (CART) ---
  function renderCart() {
    const list = document.getElementById('cartItemsList');
    const badge = document.getElementById('cartBadgeCount');
    const totalEl = document.getElementById('cartTotalDA');
    const emptyMsg = document.getElementById('cartEmptyMsg');
    const checkoutBox = document.getElementById('cartCheckoutBox');

    const totalCount = cart.reduce((acc, it) => acc + (it.quantity || 1), 0);
    const totalPrice = cart.reduce((acc, it) => acc + (it.priceDA || 0) * (it.quantity || 1), 0);

    if (badge) badge.innerText = totalCount;
    if (totalEl) totalEl.innerText = totalPrice.toLocaleString('fr-DZ') + ' DA';

    if (totalCount === 0) {
      if (emptyMsg) emptyMsg.style.display = 'block';
      if (checkoutBox) checkoutBox.style.display = 'none';
      if (list) list.innerHTML = '';
      return;
    }

    if (emptyMsg) emptyMsg.style.display = 'none';
    if (checkoutBox) checkoutBox.style.display = 'block';

    if (list) {
      list.innerHTML = '';
      cart.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'cart-item-row';
        div.innerHTML = `
          <div class="cart-item-img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <div style="font-size: 0.72rem; color: #C5B4DA; margin: 2px 0;">
              ${item.model ? '• ' + item.model : ''}
              ${item.customization ? '<br>• ' + item.customization : ''}
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px;">
              <div class="stepper" style="transform: scale(0.85); transform-origin: left center;">
                <button onclick="window.Tapelix.updateCartQty(${idx}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="window.Tapelix.updateCartQty(${idx}, 1)">+</button>
              </div>
              <strong style="color: #FAF7FC;">${((item.priceDA || 0) * item.quantity).toLocaleString('fr-DZ')} DA</strong>
            </div>
          </div>
          <button onclick="window.Tapelix.removeCartItem(${idx})" style="color: #C5B4DA; padding: 4px; align-self: flex-start; cursor: pointer; background:none; border:none;" title="Supprimer">✕</button>
        `;
        list.appendChild(div);
      });
    }
  }

  // --- 6. COMMANDE WHATSAPP (NUMÉRO 0782308820) ---
  function openWhatsAppOrder(items) {
    const phone = '213782308820';
    const total = items.reduce((acc, it) => acc + (it.priceDA || 0) * (it.quantity || 1), 0);

    const clientName = document.getElementById('cartClientName')?.value || '';
    const clientPhone = document.getElementById('cartClientPhone')?.value || '';
    const clientWilaya = document.getElementById('cartClientWilaya')?.value || '';

    let msg = `Bonjour TAPELIX 👋\nJe souhaite passer commande sur tapelix.dz :\n\n`;

    items.forEach((item, i) => {
      msg += `*${i + 1}. ${item.name}* (x${item.quantity})\n`;
      msg += `• Prix unitaire : ${item.priceDA.toLocaleString('fr-DZ')} DA\n`;
      if (item.model) msg += `• Modèle : ${item.model}\n`;
      if (item.networks) msg += `• Réseaux : ${item.networks}\n`;
      if (item.customization) msg += `• Personnalisation : ${item.customization}\n`;
      msg += `• Sous-total : ${(item.priceDA * item.quantity).toLocaleString('fr-DZ')} DA\n\n`;
    });

    msg += `💰 *TOTAL : ${total.toLocaleString('fr-DZ')} DA*\n\n`;

    if (clientName || clientPhone || clientWilaya) {
      msg += `📋 *Coordonnées client :*\n`;
      if (clientName) msg += `• Nom : ${clientName}\n`;
      if (clientPhone) msg += `• Téléphone : ${clientPhone}\n`;
      if (clientWilaya) msg += `• Wilaya / Ville : ${clientWilaya}\n`;
      msg += `\n`;
    }

    msg += `Merci de me confirmer la prise en charge et le délai d’expédition.`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }

  // --- 7. CARROUSEL DE PHOTOS ET ZOOM LIGHTBOX ---
  function renderCardCarousel() {
    const carousel = document.getElementById('cardPhotosCarousel');
    if (!carousel) return;

    carousel.innerHTML = '';
    cardPhotos.forEach((photo) => {
      const card = document.createElement('div');
      card.className = 'card-item';
      card.innerHTML = `
        <div class="card-thumb" onclick="window.Tapelix.openZoom('${photo.id}')">
          <img src="${photo.image}" alt="${photo.title}">
          <div class="card-tag">
            <span>●</span>
            <span style="text-transform: capitalize;">${photo.tag}</span>
          </div>
          <button class="zoom-trigger" title="Agrandir">🔍</button>
        </div>
        <div class="card-body">
          <div>
            <h3>${photo.title}</h3>
            <span class="card-model-name">Modèle : ${photo.model}</span>
            <p class="card-desc">${photo.desc}</p>
          </div>
          <div class="card-foot">
            <span class="card-price">Dès ${cardPricing.oneNetwork.toLocaleString('fr-DZ')} DA</span>
            <button class="btn-card-select" onclick="window.Tapelix.openConfiguratorWith('${photo.tag}')">
              Configurer
            </button>
          </div>
        </div>
      `;
      carousel.appendChild(card);
    });
  }

  // --- 8. ADMINISTRATION DES PRIX ET PHOTOS ---
  function setupAdmin() {
    const p1 = document.getElementById('admPrice1');
    const p2 = document.getElementById('admPrice2');
    const p3 = document.getElementById('admPrice3');
    const p4 = document.getElementById('admPrice4');
    if (p1 && p2 && p3 && p4) {
      p1.value = cardPricing.oneNetwork;
      p2.value = cardPricing.twoNetworks;
      p3.value = cardPricing.threeNetworks;
      p4.value = cardPricing.fourNetworks;
    }

    const adminForm = document.getElementById('adminPricingForm');
    if (adminForm) {
      adminForm.addEventListener('submit', (e) => {
        e.preventDefault();
        cardPricing.oneNetwork = Number(p1.value) || 2800;
        cardPricing.twoNetworks = Number(p2.value) || 3200;
        cardPricing.threeNetworks = Number(p3.value) || 3600;
        cardPricing.fourNetworks = Number(p4.value) || 3900;
        setStorage('tapelix_pricing', cardPricing);
        renderCardCarousel();
        updateConfigSummary();
        alert('Prix enregistrés avec succès !');
        closeModal('adminModal');
      });
    }

    const addPhotoForm = document.getElementById('adminAddPhotoForm');
    if (addPhotoForm) {
      addPhotoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('admPhotoTitle')?.value;
        const tag = document.getElementById('admPhotoTag')?.value;
        const img = document.getElementById('admPhotoUrl')?.value;
        const model = document.getElementById('admPhotoModel')?.value;
        const desc = document.getElementById('admPhotoDesc')?.value;

        if (title && img) {
          cardPhotos.unshift({
            id: 'photo-' + Date.now(),
            title,
            tag: tag || 'custom',
            image: img,
            model: model || 'Noir Mat',
            desc: desc || 'Carte NFC professionnelle'
          });
          setStorage('tapelix_photos', cardPhotos);
          renderCardCarousel();
          alert('Photo ajoutée au carrousel !');
          addPhotoForm.reset();
        }
      });
    }
  }

  // --- 9. HELPERS MODALES & DRAWER ---
  function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  }

  function openCartDrawer() {
    const overlay = document.getElementById('cartDrawerOverlay');
    const panel = document.getElementById('cartDrawerPanel');
    if (overlay) overlay.classList.add('active');
    if (panel) panel.classList.add('active');
  }

  function closeCartDrawer() {
    const overlay = document.getElementById('cartDrawerOverlay');
    const panel = document.getElementById('cartDrawerPanel');
    if (overlay) overlay.classList.remove('active');
    if (panel) panel.classList.remove('active');
  }

  // --- 10. EXPOSITION DES FONCTIONS GLOBALES (WINDOW.TAPELIX) ---
  window.Tapelix = {
    openConfigurator: function () {
      configState.selectedNetworks = ['instagram'];
      renderNetworkButtonsState();
      updateConfigSummary();
      openModal('cardConfigModal');
    },

    openConfiguratorWith: function (tag) {
      if (['instagram', 'tiktok', 'facebook', 'whatsapp'].includes(tag)) {
        configState.selectedNetworks = [tag];
      } else {
        configState.selectedNetworks = ['instagram'];
      }
      renderNetworkButtonsState();
      updateConfigSummary();
      openModal('cardConfigModal');
    },

    openZoom: function (id) {
      const photo = cardPhotos.find((p) => p.id === id);
      if (!photo) return;
      const zoomImg = document.getElementById('zoomImg');
      const zoomTitle = document.getElementById('zoomTitle');
      const zoomDesc = document.getElementById('zoomDesc');
      const zoomModel = document.getElementById('zoomModel');
      const btnZoomSelect = document.getElementById('btnZoomSelect');

      if (zoomImg) zoomImg.src = photo.image;
      if (zoomTitle) zoomTitle.innerText = photo.title;
      if (zoomDesc) zoomDesc.innerText = photo.desc;
      if (zoomModel) zoomModel.innerText = 'Modèle : ' + photo.model;
      if (btnZoomSelect) {
        btnZoomSelect.onclick = function () {
          closeModal('zoomModal');
          window.Tapelix.openConfiguratorWith(photo.tag);
        };
      }
      openModal('zoomModal');
    },

    openCart: function () {
      openCartDrawer();
    },

    closeCart: function () {
      closeCartDrawer();
    },

    updateCartQty: function (index, delta) {
      if (cart[index]) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }
        setStorage('tapelix_cart', cart);
        renderCart();
      }
    },

    removeCartItem: function (index) {
      cart.splice(index, 1);
      setStorage('tapelix_cart', cart);
      renderCart();
    },

    checkoutCartWhatsApp: function () {
      if (cart.length === 0) return;
      openWhatsAppOrder(cart);
    },

    openAdmin: function () {
      openModal('adminModal');
    },

    closeModal: closeModal,

    scrollCarousel: function (dir) {
      const el = document.getElementById('cardPhotosCarousel');
      if (el) {
        el.scrollBy({ left: dir * 310, behavior: 'smooth' });
      }
    },

    orderProductDirect: function (name, priceDA, image) {
      window.TapelixOrderModal.open({
        productName: name,
        category: 'Catalogue TAPELIX',
        unitPrice: priceDA,
        image: image || ''
      });
    }
  };

  // --- 11. INITIALISATION MULTI-PHASE SÉCURISÉE ---
  function initApp() {
    try {
      setupConfigurator();
    } catch (e) {
      console.warn('Tapelix config init warning:', e);
    }
    try {
      renderNetworkButtonsState();
      updateConfigSummary();
    } catch (e) {
      console.warn('Tapelix summary init warning:', e);
    }
    try {
      renderCardCarousel();
    } catch (e) {
      console.warn('Tapelix carousel init warning:', e);
    }
    try {
      renderCart();
    } catch (e) {
      console.warn('Tapelix cart init warning:', e);
    }
    try {
      setupAdmin();
    } catch (e) {
      console.warn('Tapelix admin init warning:', e);
    }

    try {
      const contactForm = document.getElementById('contactForm');
      if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.getElementById('ctName')?.value || '';
          const email = document.getElementById('ctEmail')?.value || '';
          const phone = document.getElementById('ctPhone')?.value || '';
          const msg = document.getElementById('ctMsg')?.value || '';

          const text = `Bonjour TAPELIX 👋\nMessage depuis tapelix.dz :\n\n• Nom : ${name}\n• E-mail : ${email || 'Non renseigné'}\n• Téléphone : ${phone}\n• Message : ${msg}`;
          window.open(`https://wa.me/213782308820?text=${encodeURIComponent(text)}`, '_blank');
        });
      }
    } catch (e) {}

    try {
      const mobileBtn = document.getElementById('mobileMenuBtn');
      if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
          const nav = document.querySelector('.main-nav');
          if (nav) {
            nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
          }
        });
      }
    } catch (e) {}
  }

  // --- 12. SYSTÈME DE COMMANDE UNIVERSEL MODAL RÉUTILISABLE ---
  const orderModalState = {
    productName: 'Produit TAPELIX',
    category: 'Catalogue',
    unitPrice: 2000,
    quantity: 1,
    deliveryMode: 'home',
    selectedSocials: {
      instagram: true,
      tiktok: false,
      facebook: false
    },
    handles: {
      instagram: '',
      tiktok: '',
      facebook: ''
    }
  };

  function injectUniversalOrderModal() {
    if (document.getElementById('tapelixOrderModal')) return;
    const div = document.createElement('div');
    div.id = 'tapelixOrderModal';
    div.style.cssText = 'position: fixed; inset: 0; background: rgba(21, 19, 27, 0.85); backdrop-filter: blur(8px); z-index: 1000; display: none; align-items: center; justify-content: center; padding: 1rem; overflow-y: auto;';
    div.innerHTML = `
      <div style="background: #15131B; border: 1px solid #76618E; border-radius: 16px; width: 100%; max-width: 650px; max-height: 90vh; overflow-y: auto; padding: 1.75rem; color: #F2EEF5; box-shadow: 0 20px 50px rgba(0,0,0,0.7); position: relative;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #30283D; padding-bottom: 1rem; margin-bottom: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.5rem;">⚡</span>
            <div>
              <h3 id="mTitle" class="font-display" style="font-size: 1.25rem; font-weight: 700; margin: 0; color: #F2EEF5;">Commander le produit</h3>
              <span id="mCategory" style="font-size: 0.75rem; color: #B7A5C9; text-transform: uppercase;">Catégorie</span>
            </div>
          </div>
          <button onclick="window.TapelixOrderModal.close()" style="background: #30283D; color: #F2EEF5; border: 1px solid #76618E; width: 36px; height: 36px; border-radius: 50%; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
        </div>

        <div style="margin-bottom: 1.25rem;" id="mSocialSection">
          <label style="font-size: 0.85rem; font-weight: 700; color: #B7A5C9; display: block; margin-bottom: 0.5rem;">1. Réseaux sociaux et options</label>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 0.75rem;">
            <div id="msoc-instagram" class="msoc-card" onclick="window.TapelixOrderModal.toggleSocial('instagram')" style="background: #30283D; border: 2px solid #76618E; border-radius: 10px; padding: 0.85rem; cursor: pointer; text-align: center;">
              <div style="font-size: 1.2rem; margin-bottom: 0.2rem;">📷</div>
              <strong style="font-size: 0.85rem; display: block; color: #F2EEF5;">Instagram</strong>
            </div>
            <div id="msoc-tiktok" class="msoc-card" onclick="window.TapelixOrderModal.toggleSocial('tiktok')" style="background: #30283D; border: 1px solid rgba(118,97,142,0.3); border-radius: 10px; padding: 0.85rem; cursor: pointer; text-align: center;">
              <div style="font-size: 1.2rem; margin-bottom: 0.2rem;">🎵</div>
              <strong style="font-size: 0.85rem; display: block; color: #F2EEF5;">TikTok</strong>
            </div>
            <div id="msoc-facebook" class="msoc-card" onclick="window.TapelixOrderModal.toggleSocial('facebook')" style="background: #30283D; border: 1px solid rgba(118,97,142,0.3); border-radius: 10px; padding: 0.85rem; cursor: pointer; text-align: center;">
              <div style="font-size: 1.2rem; margin-bottom: 0.2rem;">📘</div>
              <strong style="font-size: 0.85rem; display: block; color: #F2EEF5;">Facebook</strong>
            </div>
          </div>
          <div id="mSocialInputs" style="background: #1e1a26; border: 1px solid rgba(118,97,142,0.3); border-radius: 10px; padding: 1rem;">
            <div style="margin-bottom: 0.75rem;">
              <label style="font-size: 0.75rem; color: #B7A5C9; display: block; margin-bottom: 0.2rem;">Compte Instagram (Nom / Pseudo / Lien)</label>
              <input type="text" id="mHandleInsta" class="form-control" placeholder="@votre_compte" oninput="window.TapelixOrderModal.updateHandle('instagram', this.value)">
            </div>
          </div>
        </div>

        <div style="margin-bottom: 1.25rem;">
          <label style="font-size: 0.85rem; font-weight: 700; color: #B7A5C9; display: block; margin-bottom: 0.5rem;">2. Vos coordonnées</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
            <div>
              <label style="font-size: 0.75rem; color: #B7A5C9; display: block; margin-bottom: 0.2rem;">Nom et Prénom *</label>
              <input type="text" id="mClientName" class="form-control" placeholder="Karim Meziane" required>
            </div>
            <div>
              <label style="font-size: 0.75rem; color: #B7A5C9; display: block; margin-bottom: 0.2rem;">Téléphone *</label>
              <input type="tel" id="mClientPhone" class="form-control" placeholder="07XX XX XX XX" required>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
            <div>
              <label style="font-size: 0.75rem; color: #B7A5C9; display: block; margin-bottom: 0.2rem;">Wilaya *</label>
              <input type="text" id="mClientWilaya" class="form-control" placeholder="Alger, Oran..." required>
            </div>
            <div>
              <label style="font-size: 0.75rem; color: #B7A5C9; display: block; margin-bottom: 0.2rem;">Commune *</label>
              <input type="text" id="mClientCommune" class="form-control" placeholder="Bab Ezzouar..." required>
            </div>
          </div>
          <div>
            <label style="font-size: 0.75rem; color: #B7A5C9; display: block; margin-bottom: 0.2rem;">Adresse complète</label>
            <input type="text" id="mClientAddress" class="form-control" placeholder="Rue, quartier, repère...">
          </div>
        </div>

        <div style="margin-bottom: 1.25rem;">
          <label style="font-size: 0.85rem; font-weight: 700; color: #B7A5C9; display: block; margin-bottom: 0.5rem;">3. Mode de livraison</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
            <div id="mdelivHome" onclick="window.TapelixOrderModal.setDelivery('home')" style="background: #30283D; border: 2px solid #76618E; border-radius: 10px; padding: 0.85rem; cursor: pointer;">
              <div style="font-weight: 700; font-size: 0.9rem; color: #F2EEF5;">🏠 À domicile</div>
              <div style="font-size: 0.75rem; color: #B7A5C9;">Livraison par coursier</div>
            </div>
            <div id="mdelivDesk" onclick="window.TapelixOrderModal.setDelivery('desk')" style="background: #30283D; border: 1px solid rgba(118,97,142,0.3); border-radius: 10px; padding: 0.85rem; cursor: pointer;">
              <div style="font-weight: 700; font-size: 0.9rem; color: #F2EEF5;">🏢 Stop Desk</div>
              <div style="font-size: 0.75rem; color: #B7A5C9;">Retrait bureau Wilaya</div>
            </div>
          </div>
          <div id="mDeskArea" style="display: none;">
            <label style="font-size: 0.75rem; color: #B7A5C9; display: block; margin-bottom: 0.2rem;">Bureau / Point de retrait souhaité</label>
            <input type="text" id="mClientDesk" class="form-control" placeholder="Ex: Bureau Yalidine centre-ville">
          </div>
        </div>

        <div style="margin-bottom: 1.25rem; background: #1e1a26; border: 1px solid rgba(118,97,142,0.3); border-radius: 10px; padding: 1rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <span style="font-size: 0.85rem; color: #B7A5C9; font-weight: 600;">Quantité :</span>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <button type="button" onclick="window.TapelixOrderModal.updateQty(-1)" style="background: #30283D; color: #F2EEF5; border: 1px solid #76618E; width: 28px; height: 28px; border-radius: 6px; cursor: pointer; font-weight: 700;">-</button>
              <span id="mQtyVal" style="font-weight: 700; font-size: 1rem; color: #F2EEF5;">1</span>
              <button type="button" onclick="window.TapelixOrderModal.updateQty(1)" style="background: #30283D; color: #F2EEF5; border: 1px solid #76618E; width: 28px; height: 28px; border-radius: 6px; cursor: pointer; font-weight: 700;">+</button>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.3rem;">
            <span style="color: #B7A5C9;">Prix produits :</span>
            <strong id="mProdPrice" style="color: #F2EEF5;">0 DA</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.3rem;">
            <span style="color: #B7A5C9;">Frais de livraison :</span>
            <strong style="color: #F2EEF5;">500 DA</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 1.05rem; font-weight: 700; border-top: 1px solid rgba(118,97,142,0.3); padding-top: 0.5rem; margin-top: 0.5rem;">
            <span style="color: #F2EEF5;">Total final :</span>
            <strong id="mTotalPrice" style="color: #B7A5C9;">500 DA</strong>
          </div>
        </div>

        <button type="button" onclick="window.TapelixOrderModal.confirmWhatsApp()" style="width: 100%; padding: 0.95rem; background: #25D366; color: #062410; border: none; border-radius: 10px; font-weight: 700; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 4px 15px rgba(37,211,102,0.3);">
          <span>CONFIRMER MA COMMANDE SUR WHATSAPP (0782308820)</span>
          <span>💬</span>
        </button>
      </div>
    </div>
  `;
    document.body.appendChild(div);
  }

  window.TapelixOrderModal = {
    open: function(data) {
      injectUniversalOrderModal();
      orderModalState.productName = data?.productName || 'Produit TAPELIX';
      orderModalState.category = data?.category || 'Catalogue';
      orderModalState.unitPrice = data?.unitPrice || 2000;
      orderModalState.quantity = 1;
      orderModalState.deliveryMode = 'home';
      orderModalState.selectedSocials = { instagram: true, tiktok: false, facebook: false };
      orderModalState.handles = { instagram: '', tiktok: '', facebook: '' };

      const titleEl = document.getElementById('mTitle');
      const catEl = document.getElementById('mCategory');
      if (titleEl) titleEl.innerText = orderModalState.productName;
      if (catEl) catEl.innerText = orderModalState.category;

      const socialSec = document.getElementById('mSocialSection');
      if (socialSec) {
        socialSec.style.display = 'block';
      }

      this.renderSocials();
      this.setDelivery('home');
      this.updateSummary();

      const modal = document.getElementById('tapelixOrderModal');
      if (modal) modal.style.display = 'flex';
    },

    close: function() {
      const modal = document.getElementById('tapelixOrderModal');
      if (modal) modal.style.display = 'none';
    },

    toggleSocial: function(soc) {
      orderModalState.selectedSocials[soc] = !orderModalState.selectedSocials[soc];
      this.renderSocials();
      this.updateSummary();
    },

    renderSocials: function() {
      ['instagram', 'tiktok', 'facebook'].forEach(soc => {
        const card = document.getElementById(`msoc-${soc}`);
        if (card) {
          if (orderModalState.selectedSocials[soc]) {
            card.style.borderColor = '#76618E';
            card.style.background = '#3c324e';
          } else {
            card.style.borderColor = 'rgba(118,97,142,0.3)';
            card.style.background = '#30283D';
          }
        }
      });

      const inputsArea = document.getElementById('mSocialInputs');
      if (inputsArea) {
        let html = '';
        ['instagram', 'tiktok', 'facebook'].forEach(soc => {
          if (orderModalState.selectedSocials[soc]) {
            const title = soc.charAt(0).toUpperCase() + soc.slice(1);
            html += `
              <div style="margin-bottom: 0.75rem;">
                <label style="font-size: 0.75rem; color: #B7A5C9; display: block; margin-bottom: 0.2rem;">Compte ${title} (Nom / Pseudo / Lien)</label>
                <input type="text" class="form-control" value="${orderModalState.handles[soc] || ''}" placeholder="@votre_${soc}" oninput="window.TapelixOrderModal.updateHandle('${soc}', this.value)">
              </div>
            `;
          }
        });
        inputsArea.innerHTML = html || '<span style="font-size: 0.75rem; color: #B7A5C9;">Aucun réseau sélectionné.</span>';
      }
    },

    updateHandle: function(soc, val) {
      orderModalState.handles[soc] = val;
    },

    setDelivery: function(mode) {
      orderModalState.deliveryMode = mode;
      const homeCard = document.getElementById('mdelivHome');
      const deskCard = document.getElementById('mdelivDesk');
      const deskArea = document.getElementById('mDeskArea');

      if (homeCard && deskCard && deskArea) {
        if (mode === 'home') {
          homeCard.style.borderColor = '#76618E';
          homeCard.style.borderWidth = '2px';
          deskCard.style.borderColor = 'rgba(118,97,142,0.3)';
          deskCard.style.borderWidth = '1px';
          deskArea.style.display = 'none';
        } else {
          deskCard.style.borderColor = '#76618E';
          deskCard.style.borderWidth = '2px';
          homeCard.style.borderColor = 'rgba(118,97,142,0.3)';
          homeCard.style.borderWidth = '1px';
          deskArea.style.display = 'block';
        }
      }
    },

    updateQty: function(delta) {
      orderModalState.quantity += delta;
      if (orderModalState.quantity < 1) orderModalState.quantity = 1;
      const qVal = document.getElementById('mQtyVal');
      if (qVal) qVal.innerText = orderModalState.quantity;
      this.updateSummary();
    },

    updateSummary: function() {
      const qVal = document.getElementById('mQtyVal');
      if (qVal) qVal.innerText = orderModalState.quantity;

      const prodTotal = orderModalState.unitPrice * orderModalState.quantity;
      const finalTotal = prodTotal + 500;

      const pPrice = document.getElementById('mProdPrice');
      const tPrice = document.getElementById('mTotalPrice');

      if (pPrice) pPrice.innerText = prodTotal.toLocaleString('fr-DZ') + ' DA';
      if (tPrice) tPrice.innerText = finalTotal.toLocaleString('fr-DZ') + ' DA';
    },

    confirmWhatsApp: function() {
      const name = document.getElementById('mClientName')?.value.trim() || '';
      const phone = document.getElementById('mClientPhone')?.value.trim() || '';
      const wilaya = document.getElementById('mClientWilaya')?.value.trim() || '';
      const commune = document.getElementById('mClientCommune')?.value.trim() || '';
      const address = document.getElementById('mClientAddress')?.value.trim() || '';
      const desk = document.getElementById('mClientDesk')?.value.trim() || '';

      if (!name || !phone || !wilaya || !commune) {
        alert('Veuillez remplir vos coordonnées obligatoires (Nom, Téléphone, Wilaya et Commune).');
        return;
      }

      const prodTotal = orderModalState.unitPrice * orderModalState.quantity;
      const finalTotal = prodTotal + 500;

      let msg = `Bonjour TAPELIX 👋\nJe souhaite commander :\n\n`;
      msg += `• *Produit :* ${orderModalState.productName}\n`;
      msg += `• *Catégorie :* ${orderModalState.category}\n`;
      msg += `• *Quantité :* ${orderModalState.quantity}\n`;
      msg += `• *Prix unitaire :* ${orderModalState.unitPrice.toLocaleString('fr-DZ')} DA\n`;

      ['instagram', 'tiktok', 'facebook'].forEach(soc => {
        if (orderModalState.selectedSocials[soc] && orderModalState.handles[soc]) {
          const title = soc.charAt(0).toUpperCase() + soc.slice(1);
          msg += `• *Réseau ${title} :* ${orderModalState.handles[soc]}\n`;
        }
      });

      msg += `\n📦 *Mode de livraison :* ${orderModalState.deliveryMode === 'home' ? 'À domicile' : 'Stop Desk'}\n`;
      if (orderModalState.deliveryMode === 'desk' && desk) {
        msg += `• *Bureau de retrait :* ${desk}\n`;
      }

      msg += `\n💰 *Détails financiers :*\n`;
      msg += `• Total produits : ${prodTotal.toLocaleString('fr-DZ')} DA\n`;
      msg += `• Frais de livraison : 500 DA\n`;
      msg += `• *TOTAL FINAL : ${finalTotal.toLocaleString('fr-DZ')} DA*\n\n`;

      msg += `📋 *Coordonnées client :*\n`;
      msg += `• Nom : ${name}\n`;
      msg += `• Téléphone : ${phone}\n`;
      msg += `• Wilaya / Commune : ${wilaya}, ${commune}\n`;
      if (address) msg += `• Adresse : ${address}\n`;

      msg += `\nMerci de me confirmer la prise en charge de ma commande.`;

      const url = `https://wa.me/213782308820?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
      this.close();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
