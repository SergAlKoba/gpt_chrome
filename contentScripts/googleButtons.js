// function createHtmlElement(tag, attributes = {}, children = []) {
//     const element = document.createElement(tag);
  
//     for (const [key, value] of Object.entries(attributes)) {
//       element.setAttribute(key, value);
//     }
  
//     for (const child of children) {
//       element.appendChild(child);
//     }
  
//     return element;
//   }
  
//   function createLatestGoogle() {
//     const infoImage = createHtmlElement('img', {
//       src: 'assets/images/Info.svg',
//       alt: '',
//     });
  
//     const infoSpan = createHtmlElement('span', { class: 'info' }, [infoImage]);
  
//     const latestDataText = createHtmlElement('p', {}, [
//       document.createTextNode('Include latest google data'),
//     ]);
  
//     const switchButton = createHtmlElement('button', {
//       class:
//         'bg-green-600 relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 h-6 w-11',
//       id: 'headlessui-switch-:rh:',
//       role: 'switch',
//       type: 'button',
//       tabindex: '0',
//       'aria-checked': 'true',
//       'data-headlessui-state': 'checked',
//     });
  
//     const latestDataDiv = createHtmlElement('div', { class: 'latest_data' }, [
//       infoSpan,
//       latestDataText,
//       switchButton,
//     ]);
  
//     return latestDataDiv;
//   }
  
//   function createToneList() {
//     const toneItems = ['Persuasive 1', 'Persuasive 2', 'Persuasive 3', 'Persuasive 4', 'Persuasive 5', 'Persuasive 6'].map(
//       (text) => createHtmlElement('li', {}, [document.createTextNode(text)])
//     );
  
//     const toneList = createHtmlElement('ul', {}, toneItems);
  
//     const toneTitle = createHtmlElement('p', {}, [
//       document.createTextNode('Tone :'),
//     ]);
  
//     const toneDiv = createHtmlElement('div', { class: 'tone' }, [
//       toneTitle,
//       toneList,
//     ]);
  
//     return toneDiv;
//   }
  
//   function createStyleList() {
//     const styleItems = ['Descriptive 1', 'Descriptive 2', 'Descriptive 3', 'Descriptive 4', 'Descriptive 5', 'Descriptive 6'].map(
//       (text) => createHtmlElement('li', {}, [document.createTextNode(text)])
//     );
  
//     const styleList = createHtmlElement('ul', {}, styleItems);
  
//     const styleTitle = createHtmlElement('p', {}, [
//       document.createTextNode('Style :'),
//     ]);
  
//     const styleDiv = createHtmlElement('div', { class: 'style' }, [
//       styleTitle,
//       styleList,
//     ]);
  
//     return styleDiv;
//   }
  
//   function createLatestGoogleContainer() {
//     const latestGoogleDiv = createHtmlElement('div', { class: 'latest_google' }, [
//       createLatestGoogle(),
//       createToneList(),
//       createStyleList(),
//     ]);
  
//     return latestGoogleDiv;
//   }
  
//   document.body.appendChild(createLatestGoogleContainer());
  