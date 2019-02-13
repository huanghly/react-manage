export default function isWeChat(){
  let ua = navigator.userAgent.toLowerCase();
  return (/micromessenger/.test(ua));
};
