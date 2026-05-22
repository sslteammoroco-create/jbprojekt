import { db } from './firebase-init.js';
import {
    collection,
    onSnapshot,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const productsCollection = collection(db, 'products');
const grid = document.getElementById('products-grid');
const countEl = document.getElementById('product-count');

function createProductCard(product, index) {
    const staggerClass = index % 3 === 1 ? 'lg:mt-12' : index % 3 === 2 ? 'lg:mt-[-48px]' : '';
    const mainImg = product.image || 'https://placehold.co/400x400/e8e8e8/001e40?text=CNC+Tool';
    const altImg1 = 'https://images.unsplash.com/photo-1565439399-1da88b1ccf28?auto=format&fit=crop&q=80&w=600';
    const altImg2 = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600';

    return `
        <div class="group relative flex flex-col bg-surface border-none overflow-hidden antigravity ${staggerClass}">
            <div class="aspect-square bg-surface-container-low overflow-hidden relative">
                <a href="checkout.html?pid=${product.id}" class="block w-full h-full">
                    <div class="slider-container">
                        <div class="slider-track">
                            <div class="slider-slide"><img alt="${product.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="${mainImg}" onerror="this.src='https://placehold.co/400x400/e8e8e8/001e40?text=CNC+Tool'"/></div>
                            <div class="slider-slide"><img alt="${product.name} - Vue 2" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="${altImg1}"/></div>
                            <div class="slider-slide"><img alt="${product.name} - Vue 3" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="${altImg2}"/></div>
                        </div>
                    </div>
                </a>
                <div class="absolute top-0 right-0 p-4">
                    <span class="bg-secondary-container text-on-secondary-container px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
                        ${product.category || 'Outil'}
                    </span>
                </div>
            </div>
            <div class="pt-6 flex flex-col flex-grow">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-headline text-xl font-bold text-primary uppercase leading-tight tracking-tight max-w-[70%]">
                        ${product.name}
                    </h3>
                </div>
                <p class="text-secondary text-sm font-normal mb-6 line-clamp-2 leading-relaxed">
                    ${product.description || ''}
                </p>
                <div class="mt-auto">
                    <a href="checkout.html?pid=${product.id}" class="w-full bg-primary-container text-on-primary py-3 text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors flex items-center justify-center gap-2">
                        Détails
                        <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                </div>
            </div>
        </div>
    `;
}

function renderCTACard() {
    return `
        <div class="group relative flex flex-col bg-primary-container p-8 justify-center text-on-primary">
            <div class="border border-on-primary-container/30 p-6 flex flex-col h-full border-dashed">
                <h3 class="font-headline text-2xl font-bold uppercase mb-4 leading-none">Spécifications<br/>Personnalisées ?</h3>
                <p class="text-blue-100 text-sm mb-8 font-light">Notre équipe d'ingénierie peut fabriquer des outils en carbure sur mesure pour des besoins de fabrication spécialisés.</p>
                <div class="mt-auto">
                    <a class="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] border-b border-on-primary-container pb-2 hover:text-white transition-colors" href="about.html#contact">
                        Support Technique <span class="material-symbols-outlined text-sm">settings</span>
                    </a>
                </div>
            </div>
        </div>
    `;
}

function loadProducts() {
    const q = query(productsCollection, orderBy('createdAt', 'desc'));

    onSnapshot(q, (snapshot) => {
        if (!grid) return;

        if (snapshot.empty) {
            grid.innerHTML = `
                <div class="col-span-3 py-24 text-center">
                    <p class="text-secondary text-lg italic">Aucun produit disponible pour le moment.</p>
                </div>
                ${renderCTACard()}
            `;
            if (countEl) countEl.textContent = '0 / 0 Unités de Précision';
            return;
        }

        const products = [];
        snapshot.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });

        // Update count display
        if (countEl) {
            const total = String(products.length).padStart(2, '0');
            countEl.textContent = `Affichage : ${total} / ${total} Unités de Précision`;
        }

        // Render product cards + CTA
        grid.innerHTML = products.map((product, i) => createProductCard(product, i)).join('') + renderCTACard();

        // Re-initialize physics and sliders
        setTimeout(() => {
            if (typeof window.initSliders === 'function') window.initSliders();
            if (typeof window.initAntigravity === 'function') window.initAntigravity();
        }, 50);
    });
}

document.addEventListener('DOMContentLoaded', loadProducts);
