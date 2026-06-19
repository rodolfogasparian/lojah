"use client";

import { QRCodeSVG } from "qrcode.react";

export function SellerQrCode({ value }: { value: string }) {
  return (
    <QRCodeSVG
      value={value}
      size={144}
      level="M"
      marginSize={2}
      className="rounded-md border border-border p-2"
    />
  );
}
