function createButtonWithSVG() {
    
    const div = document.createElement('div');
    const button = document.createElement('button');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

   
    div.classList.add('button_wait');
    button.classList.add('');
    svg.setAttribute('width', '22');
    svg.setAttribute('height', '20');
    svg.setAttribute('viewBox', '0 0 22 20');
    svg.setAttribute('fill', 'none');
    path.setAttribute('d', 'M10.1033 0.816987C10.4701 0.0737414 11.5299 0.0737401 11.8967 0.816986L14.294 5.67446C14.4397 5.9696 14.7213 6.17417 15.047 6.2215L20.4075 7.00043C21.2277 7.11961 21.5552 8.12759 20.9617 8.70612L17.0828 12.4871C16.8471 12.7169 16.7396 13.0479 16.7952 13.3723L17.7109 18.7111C17.851 19.528 16.9936 20.151 16.26 19.7653L11.4653 17.2446C11.174 17.0915 10.826 17.0915 10.5347 17.2446L5.74005 19.7653C5.00642 20.151 4.14899 19.528 4.2891 18.7111L5.20479 13.3723C5.26043 13.0479 5.15288 12.7169 4.91719 12.4871L1.03827 8.70612C0.444756 8.12759 0.772265 7.11961 1.59249 7.00043L6.95302 6.2215C7.27873 6.17417 7.5603 5.9696 7.70596 5.67446L10.1033 0.816987Z');
    path.setAttribute('fill', '#FFA959');

   
    svg.appendChild(path);
    button.appendChild(svg);
    div.appendChild(button);

    
    return div;
}

document.querySelector("#global > header > div.account > div.settings").appendChild(createButtonWithSVG());

