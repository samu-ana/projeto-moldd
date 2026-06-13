function desenharLinhaCurva(wrapper) {
    const svg = wrapper.querySelector('.curved-line-svg');
    const path = wrapper.querySelector('#curve-path');
    const spans = wrapper.querySelectorAll('.step-item span');
    
    if (spans.length < 2 || !path) return;

    // Sincroniza perfeitamente o tamanho do SVG com a caixa das etapas
    svg.setAttribute('width', wrapper.offsetWidth);
    svg.setAttribute('height', wrapper.offsetHeight);

    let pathData = "";

    // Mapeia o centro exato de cada círculo numérico usandogetBoundingClientRect() relativo ao wrapper
    const rectWrapper = wrapper.getBoundingClientRect();
    const pontos = Array.from(spans).map(span => {
        const rectSpan = span.getBoundingClientRect();
        return {
            x: (rectSpan.left + rectSpan.width / 2) - rectWrapper.left,
            y: (rectSpan.top + rectSpan.height / 2) - rectWrapper.top
        };
    });

    pontos.forEach((ponto, index) => {
        if (index === 0) {
            // M = Começa rigorosamente no centro do círculo 1
            pathData += `M ${ponto.x} ${ponto.y}`;
        } else {
            const pontoAnterior = pontos[index - 1];
            
            // Calcula o ponto médio (metade do caminho) entre o círculo anterior e o atual
            const meioX = pontoAnterior.x + (ponto.x - pontoAnterior.x) / 2;
            const meioY = pontoAnterior.y + (ponto.y - pontoAnterior.y) / 2;
            
            // S-Curve Dinâmica: Faz uma curva suave em S usando o ponto médio como referência.
            // Isso força o traço a mudar de direção na metade do caminho, entrando perfeito no centro do alvo.
            pathData += ` Q ${pontoAnterior.x} ${meioY}, ${meioX} ${meioY}`;
            pathData += ` Q ${ponto.x} ${meioY}, ${ponto.x} ${ponto.y}`;
        }
    });

    path.setAttribute('d', pathData);
}


// Recalcula o traço automaticamente caso o usuário mude o tamanho do navegador
window.addEventListener('resize', () => {
    const wrapper = document.querySelector('.etapas-wrapper');
    if (wrapper) desenharLinhaCurva(wrapper);
});

// 2. MONTAGEM DINÂMICA DO CONTAINER DO CARROSSEL
const container = document.createElement('div');
container.className = 'carousel-container';

const itemsCount = 4;
const realItems = [];

for (let i = 0; i < itemsCount; i++) {
    const item = document.createElement('div');
    item.className = `carousel-item item-${i}`;

    // Item 0: Boas-vindas
    if (i === 0) {
        const title = document.createElement('h3');
        title.textContent = 'Seja Bem Vindo ao Moldd';
        const img = document.createElement('img');
        img.className = 'logo';
        img.src = 'logo.png';
        const desc = document.createElement('p');
        desc.textContent = 'Onde você poderá encomendar objetos personalizados ao seu gosto!';
        item.append(title, img, desc);
    } 
    // Item 1: Canecas e Camisas
    else if (i === 1) {
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const img = document.createElement('img');
        img.className = 'example';
        img.src = 'glass.jpeg';
        const desc = document.createElement('p');
        desc.textContent = 'Sua dose diária de inspiração. Transforme o café da manhã ou a rotina de trabalho em um momento único com uma caneca que leva a sua identidade, frase favorita ou foto especial. Cerâmica premium com estampa de alta definição que não desbota.';
        const img2 = document.createElement('img');
        img2.className = 'example';
        img2.src = 'tshirt.jpeg';
        const desc2 = document.createElement('p');
        desc2.textContent = 'Conecte pessoas através do estilo. Perfeitas para eventos, formaturas, empresas ou ações entre amigos. Personalize com o seu logotipo ou estampa criativa e garanta um visual marcante, confortável e com caimento impecável para todo mundo.';
        div1.append(img, desc);
        div2.append(img2, desc2);
        const button = document.createElement('button');
        button.textContent = 'Encomendar';
        button.className = 'btn-01';
        item.append(div1, div2, button);
    } 
    // Item 3: Seção de Etapas (Onde fica a linha curva)
    else if (i === 3) { 
        const title = document.createElement('h3');
        title.textContent = 'Etapas';
        
        const desc = document.createElement('p');
        desc.textContent = 'Veja mais sobre a gente nas nossas redes!';
        
        const containerEtapas = document.createElement('div');
        containerEtapas.className = 'etapas-wrapper';

        const list = document.createElement('ol');
        list.className = 'steps-list';
        
        const steps = {
            'Criação': 'Primeiro Passo é você escolher o produto que deseja, selecionar algum dos nossos modelos ou personalizar como preferir!', 
            'Dados': 'Preencha alguns dados para sabermos para quem vamos entregar.', 
            'Entrega': 'Agora só aguardar que seu produto chegará em sua casa prontinho!'
        };
        
        let numeroEtapa = 1;

        for (const key in steps) {
            const li = document.createElement('li');
            li.className = 'step-item';
            
            li.innerHTML = `<span>${numeroEtapa}</span> <div><strong>${key}</strong><p>${steps[key]}</p></div>`;
            list.append(li);
            numeroEtapa++;
        }
        
        // CONSERTO DO NAMESPACE: Link oficial da W3C obrigatório para renderizar SVGs dinâmicos
        const svgNamespace = "http://www.w3.org/2000/svg";
        
        const svg = document.createElementNS(svgNamespace, 'svg');
        svg.setAttribute('class', 'curved-line-svg');
        
        const path = document.createElementNS(svgNamespace, 'path');
        path.setAttribute('id', 'curve-path');
        
        svg.append(path);
        containerEtapas.append(svg, list);
        item.append(title, desc, containerEtapas);
    } 
    // Item 2: Janela Sobressalente (Copos e Bonés por exemplo)
    else {
        const desc = document.createElement('p');
        desc.textContent = `Sem conteúdo (Janela ${i + 1})`;
        item.appendChild(desc);
    }

    realItems.push(item);
}

// 3. ESTRUTURAÇÃO DO CARROSSEL INFINITO (CLONAGEM)
const firstClone = realItems[0].cloneNode(true);
const lastClone = realItems[realItems.length - 1].cloneNode(true);

firstClone.classList.add('clone');
lastClone.classList.add('clone');

const allItems = [lastClone, ...realItems, firstClone];
allItems.forEach(item => container.appendChild(item));

const itemHeight = window.innerHeight;
const total = allItems.length;
let isResetting = false;

// Evento de rolagem para criar a ilusão de infinito
container.addEventListener('scroll', () => {
    if (isResetting) return;

    const currentScroll = container.scrollTop;

    if (currentScroll <= 5) {
        isResetting = true;
        requestAnimationFrame(() => {
            container.scrollTop = itemHeight * (total - 2);
            setTimeout(() => isResetting = false, 30);
        });
    } 
    else if (currentScroll >= itemHeight * (total - 1.1)) {
        isResetting = true;
        requestAnimationFrame(() => {
            container.scrollTop = itemHeight;
            setTimeout(() => isResetting = false, 30);
        });
    }
});

// 4. INTERSECTION OBSERVER COM ADIÇÃO DO GATILHO PARA DESENHAR A CURVA
const observerOptions = {
    root: container,
    rootMargin: "-40% 0px -40% 0px",
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // GATILHO INTELIGENTE: Se a tela atual for a das Etapas (item-3), desenha a curva
            if (entry.target.classList.contains('item-3')) {
                const wrapper = entry.target.querySelector('.etapas-wrapper');
                if (wrapper) {
                    // Aguarda 450ms para a transição do CSS estabilizar e evitar posições incorretas
                    setTimeout(() => {
                        desenharLinhaCurva(wrapper);
                    }, 450);
                }
            }
        } else {
            entry.target.classList.remove('active');
        }
    });
}, observerOptions);

allItems.forEach(item => observer.observe(item));

// Injeta o carrossel no HTML e avança para o primeiro item real
document.body.appendChild(container);
container.scrollTop = itemHeight;