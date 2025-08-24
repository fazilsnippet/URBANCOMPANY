
export function loadRazorpay() {
  return new Promise((resolve) => {
    const scriptId = 'razorpay-sdk';
    if (document.getElementById(scriptId)) return resolve(true);
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
