const vendorStrings = ['$vuzix$', '$samsung$', '$nubia$'];

export default function isSupportedHeadset(identity: any) {
  return vendorStrings.some(vendor => identity.includes(vendor));
}
