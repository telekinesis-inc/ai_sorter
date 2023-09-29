import browser from 'webextension-polyfill';
import { type BrowserMessageType } from './models';

const agents = {} as any;
let started: boolean = false;
let wrapper: any;

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('content got message', message, sender)
  sendResponse();
  switch (message.type as BrowserMessageType) {
    case 'fetchResponse':
      agents[message.agent].contentWindow.postMessage(message, '*');
      break;
    case 'toggleExtension':
      started ? removeOverlay() : createOverlay();

  }
  // if (message.type == 'popupSrc') {
  // }
});
// browser.runtime.sendMessage(null, {type: 'initiateContent'})
// browser.runtime.sendMessage(null, {type: 'fetch', content: {url: 'https://public.payperrun.com/__/telekinesis.js', opts: {}}})

const removeOverlay = () => {
  started = false;
  wrapper.remove();
}

const createOverlay = async () => {
  started = true;
  wrapper = document.createElement('div');
  wrapper.id = (Math.random() + 1).toString(36).substring(7);
  document.body.appendChild(wrapper);

  const shadowRoot = wrapper.attachShadow({ mode: 'open' });

  // const ss = document.createElement('link');
  // ss.rel = 'stylesheet';
  // ss.href = 'https://public.payperrun.com/__/app.css';

  // shadowRoot.appendChild(ss);

  const s = wrapper.style
  s.bottom = '5%';
  s.right = '5%';
  s.position = 'fixed';
  s.zIndex = '99998';

  const bubble = document.createElement('div');
  bubble.innerText = '/>';
  const bs = bubble.style;
  bs.height = '40px';
  bs.width = '40px';
  bs.backgroundColor = '#242424';
  bs.color = '#1adb9b';
  bs.display = 'flex';
  bs.borderRadius = '20px';
  bs.alignItems = 'center';
  bs.justifyContent = 'center';
  bs.fontSize = '20px';
  bs.fontWeight = '800';
  bs.cursor = 'pointer';
  bs.float = 'right';
  bs.boxShadow = ' #8888 0px 0px 10px 5px';
  bs.fontFamily = 'monospace';

  const overlay = document.createElement('div');
  const os = overlay.style;
  os.height = '100%';
  os.width = '100%';
  os.backgroundColor = '#0002';
  os.cursor = 'crosshair';
  os.zIndex = '99999';
  os.position = 'fixed';
  os.top = '0';
  os.left = '0';
  os.display = 'none';


  const iframe = document.createElement('iframe');
  iframe.sandbox.add('allow-scripts', 'allow-popups')
  iframe.src = 'https://public.payperrun.com/>/browserExtension/index.html';
  const is = iframe.style;
  is.height = window.innerHeight * .9 - 60 + 'px';
  is.width = '600px';
  is.maxWidth = '600px';
  is.display = 'block'; 
  is.borderRadius = '10px';
  is.marginBottom = '10px';

  agents[wrapper.id] = iframe;

  shadowRoot.appendChild(iframe);
  bubble.onclick = () => {is.display = is.display == 'none'? 'block' : 'none'}

  shadowRoot.appendChild(bubble);
  shadowRoot.appendChild(overlay);



  window.addEventListener('message', async (message: any) => {
    //console.log(message);
    if (message.source == iframe.contentWindow) {
      switch (message.data.type) {
        case 'fetch': {
          browser.runtime.sendMessage(null, {...message.data, agent: wrapper.id})
          break;
        }
        case 'requestSelect': {
          prevOnClick = window.onclick;
          is.display = 'none';
          bs.display = 'none';
          os.display = 'block';
        
          // console.log('here')
          let promise = new Promise(r => {
            resolveSelect = (x: any) => {is.display = 'block'; bs.display = 'flex'; os.display = 'none'; r(x)};
          });
          
          window.onclick = selectContent;
          iframe?.contentWindow?.postMessage({type: 'response', requestId: message.data.requestId, content: await promise}, '*')
          break;
        }
        case 'requestSelectorText': {
          let response = Array.from(document.querySelectorAll(message.data.content)).map((x: any) => x.innerText);
          iframe?.contentWindow?.postMessage({type: 'response', requestId: message.data.requestId, content: response}, '*')
          break;
        }
        case 'getAPIkey': {
          iframe?.contentWindow?.postMessage({type: 'response', requestId: message.data.requestId, content: (await browser.storage.local.get('openAIkey')).openAIkey}, '*')
          break;
        }
        case 'setAPIkey': {
          //console.log('here2', message.data)
          await browser.storage.local.set({'openAIkey': message.data.content})
          // localStorage.setItem('test', 'ad');
          // console.log(browser.storage.local, localStorage)
          break;
        }
        default:
          //console.log(message.data);

      }
    }
  })
} 
createOverlay();

let resolveSelect: any;
let prevOnClick: any;
let classes: Set<string>;
let classSelector: any;


const selectContent = (event: any) => {
  event.preventDefault(); // Prevent default action
  window.onclick = prevOnClick;
  

  classes = new Set();
  const elements = document.elementsFromPoint(event.clientX, event.clientY);
  for (let target of elements) {
      classes.add(target.tagName);
      for (let className of Array.from(target.classList)) {
        classes.add('.'+className as string);
        //console.log(className);
      }
  }
  createClassSelector();
}

const createClassSelector = () => {
  if (classes.size) {
    classSelector = document.createElement('div');
    const s = classSelector.style
    s.position = 'fixed';
    s.top = '50%';
    s.right = '5%';
    s.transform = 'translate(0, -50%)';
    s.maxHeight = '100%';
    s.overflowY = 'auto';
    s.zIndex = '99999';
    s.display = 'flex';
    s.flexDirection = 'column';
    s.backgroundColor = 'white';
    s.color = 'black';
    s.opacity = '0.5';

    let b = document.createElement('button') as any;
    b.onclick = () => {resolveSelect(null); classSelector.remove();};
    b.innerText = 'Cancel'
    classSelector.appendChild(b);
    for (let c of classes) {
      let b = document.createElement('button') as any;
      let unhighlightArray: any;
      b.onclick = () => {
        classSelector.remove();
        unhighlightArray?.map((x: any) => x())
        resolveSelect(c)
      };
      b.onmouseenter = () => {
        unhighlightArray = Array.from(document.querySelectorAll(c)).map(highlghtElement);
      }
      b.onmouseleave = () => unhighlightArray?.map((x: any) => x())
      b.innerText = c + ': '+ document.querySelectorAll(c).length;

      classSelector.appendChild(b)
    }
    document.body.appendChild(classSelector)
  } else {
    resolveSelect(null);
  }
};
const highlghtElement = (el: Element) => {
  const {left, top, width, height} = el.getBoundingClientRect();
  const overlay = Object.assign(document.createElement('div'), {
    style: `position:fixed;left:${left}px;top:${top}px;width:${width}px;height:${height}px;background:rgba(255,0,0,0.5);z-index:9999; border: solid red 1px;`
  });
  document.body.appendChild(overlay);
  return () => document.body.removeChild(overlay);
}













// import { Entrypoint } from 'telekinesis-js';

// const wrapper = document.createElement('_test_element');
// document.children[0].appendChild(wrapper);
// const shadowRoot = wrapper.attachShadow({ mode: 'open' });

// fetch('https://public.payperrun.com/__/telekinesis.js').then(console.log).catch(console.error)
// const iframe = document.createElement('iframe');
// iframe.sandbox.add('allow-scripts', 'allow-popups');

// iframe.src = //`<script>console.log('iframe')</script>`

// browser.runtime.getURL('public/popup.html');

// wrapper.appendChild(iframe)

// @ts-ignore
// new Entrypoint('wss://payper.run').then(async (ep: any) => {iframe.srcdoc = (await ep.get('/e-neuman/fun/confidence_calibration').display('run')).src_doc})








/*
let bubbleSrc: any;

browser.runtime.sendMessage(null, {'type': 'initiateContent'})
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('content got message', message, sender)
  if (message.type == 'bubbleSrc') {
    bubbleSrc = message.value;
  }
  createBubble('test');
});

const createBubble = (name: string) => {
  const wrapper = document.createElement('div');
  wrapper.id = 'ppr-root';
  document.body.appendChild(wrapper);
  const shadowRoot = wrapper.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.innerHTML = bubbleSrc.css;
  shadowRoot.appendChild(style);

  const root = document.createElement('div')  as any;
  root.id = 'root';
let classes = new Set();
  shadowRoot.appendChild(root);

  // const script = bubbleSrc.js.replace('{{ppr-root}}', 'ppr-root')
  const script = document.createElement('script');
  script.innerHTML = bubbleSrc.js.replace('{{ppr-root}}', 'ppr-root');
  shadowRoot.appendChild(script);
} */

/*
const createBubble = (name: string) => {
  // Create shadow root
  const wrapper = document.createElement('div');
  document.body.appendChild(wrapper);
  const shadowRoot = wrapper.attachShadow({ mode: 'open' });

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .floating {
      position: fixed;
      bottom: 10%;
      right: 10%;
      width: 30px;
      height: 30px;
      border-radius: 15px;
      background-color: #f33;
      z-index: 99998;
    }
  `;
  shadowRoot.appendChild(style);

  const bubble = document.createElement('div');
  bubble.classList.add('floating');
  bubble.innerHTML = name[0].toUpperCase();

  // Add event listeners
  bubble.addEventListener('mousedown', onMouseDown);
  shadowRoot.addEventListener('mousemove', onMouseMove);
  shadowRoot.addEventListener('mouseup', onMouseUp);

  shadowRoot.appendChild(bubble);

  // Event handlers
  let isDragging: boolean;
  let offsetX: number;
  let offsetY: number;
  function onMouseDown(e: MouseEvent) {
    isDragging = true;
    offsetX = e.clientX - bubble.getBoundingClientRect().left;
    offsetY = e.clientY - bubble.getBoundingClientRect().top;
  }

  function onMouseMove(e: any) {
    if (!isDragging) return;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;
  }

  function onMouseUp() {
    isDragging = false;
  }
}*/




// import { type BrowserMessageType, type ColorScheme } from './models';




/*
let prevOnClick: any;
let classes: Set<string>;

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('content got message', message, sender);
  prevOnClick = window.onclick;
  // window.onclick = selectContent;

  sendResponse();
  // switch (message.type as BrowserMessageType) {
  //   case 'getColorScheme': {
  //     return Promise.resolve(getColorScheme());
  //   }
  // }
});

console.log('from content');
// browser.runtime.sendMessage(null, {data: 'test'})

// function getColorScheme() {
//   let scheme: ColorScheme = 'light';
//   const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
//   if (darkModeMediaQuery.matches) {
//     scheme = 'dark';
//   }
//   return scheme;
// }

const selectContent = (event: any) => {
  event.preventDefault(); // Prevent default action
  let target = event.target; // Get the clicked element
  window.onclick = prevOnClick;

  classes = new Set();
  if (target) {
    for (let _ in Array(30).fill(null)) {
      for (let className of Array.from(target.classList)) {
        classes.add(className as string);
        console.log(className);
        target = target.parentElement;
      }
      if (!target) {
        break;
      }
    }
    createClassSelector();
  }
}

let classSelector: any;

const createClassSelector = () => {
	classSelector = document.createElement('div');
	const s = classSelector.style
  s.position = 'fixed';
  s.top = '0px';
  s.right= '10px';
  s.zIndex = '99999';
  s.display = 'flex';
  s.flexDirection = 'column';
  s.backgroundColor = 'white';
  s.opacity = '0.5';

	for (let c of classes) {
		let b = document.createElement('button');
		b.onclick = () => {
      console.log(c);
      classSelector.remove();
    };
    b.onmouseenter = () => {
      Array.from(document.getElementsByClassName(c)).map(highlghtElement);

    }
		b.innerText = c + ': '+ document.getElementsByClassName(c).length;

		classSelector.appendChild(b)
	}
	document.body.appendChild(classSelector)
};

const highlghtElement = (el: Element) => {
  const {left, top, width, height} = el.getBoundingClientRect();
  const overlay = Object.assign(document.createElement('div'), {
    style: `position:fixed;left:${left}px;top:${top}px;width:${width}px;height:${height}px;background:rgba(255,0,0,0.5);z-index:9999;`
  });
  document.body.appendChild(overlay);
  setTimeout(() => document.body.removeChild(overlay), 2000);
}

}*/