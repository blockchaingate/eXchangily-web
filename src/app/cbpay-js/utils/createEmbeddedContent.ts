import { EmbeddedContentStyles } from '../types/widget';

export const EMBEDDED_IFRAME_ID = 'cbpay-embedded-onramp';

export const createEmbeddedContent = ({
  url,
  width = '100%',
  height = '100%',
  position = 'fixed',
  top = '0px',
}: {
  url: string;
} & EmbeddedContentStyles): HTMLIFrameElement => {
  const iframe = document.createElement('iframe');

  // Styles
  iframe.style.border = 'unset';
  iframe.style.borderWidth = '0';
  iframe.style.width = width.toString();
  iframe.style.height = height.toString();
  iframe.style.position = position;
  iframe.style.top = '50%';
  iframe.style.left = '50%';
  iframe.style.transform = 'translate(-50%, -50%)';
  iframe.style.zIndex = "9999";
  iframe.id = EMBEDDED_IFRAME_ID;
  iframe.src = url;

  return iframe;
};
