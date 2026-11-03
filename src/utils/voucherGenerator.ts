export interface VoucherData {
  type: 'chocolate' | 'hug';
  title: string;
  subtitle: string;
  code: string;
  claimDate: string;
}

/**
 * Draws a cute mini heart on 2D canvas
 */
function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  // Top left curve
  ctx.bezierCurveTo(
    x,
    y,
    x - size / 2,
    y,
    x - size / 2,
    y + topCurveHeight
  );
  // Bottom left curve
  ctx.bezierCurveTo(
    x - size / 2,
    y + (size + topCurveHeight) / 2,
    x,
    y + (size + topCurveHeight) / 1.5,
    x,
    y + size
  );
  // Bottom right curve
  ctx.bezierCurveTo(
    x,
    y + (size + topCurveHeight) / 1.5,
    x + size / 2,
    y + (size + topCurveHeight) / 2,
    x + size / 2,
    y + topCurveHeight
  );
  // Top right curve
  ctx.bezierCurveTo(
    x + size / 2,
    y,
    x,
    y,
    x,
    y + topCurveHeight
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function generateVoucherTicket(data: VoucherData): string {
  const canvas = document.createElement('canvas');
  // High resolution for retina clarity
  const scale = 2;
  const w = 840;
  const h = 480;
  canvas.width = w * scale;
  canvas.height = h * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.scale(scale, scale);

  const isChoc = data.type === 'chocolate';
  const primaryColor = isChoc ? '#5C3D2E' : '#C2185B';
  const accentColor = isChoc ? '#93664C' : '#E75480';
  const bgPink = '#FFF0F3';

  // 1. Background fill
  ctx.fillStyle = bgPink;
  ctx.fillRect(0, 0, w, h);

  // 2. Ticket Base Card
  const mx = 24;
  const my = 24;
  const tw = w - mx * 2;
  const th = h - my * 2;
  const r = 24;

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(mx, my, tw, th, r);
  ctx.fill();

  // 3. Ticket Left & Right Notches (Ticket cutout semicircles)
  const notchRadius = 20;
  const notchY = h / 2;

  ctx.fillStyle = bgPink;
  ctx.beginPath();
  ctx.arc(mx, notchY, notchRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(w - mx, notchY, notchRadius, 0, Math.PI * 2);
  ctx.fill();

  // 4. Left Accent Color Strip
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.roundRect(mx, my, 16, th, [r, 0, 0, r]);
  ctx.fill();

  // 5. Exclusivity Banner Header
  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.fillText('VOUCHER RESMI · EKSKLUSIF KHUSUS SHERLY NABILA (CELI)', mx + 42, my + 44);

  // Little decorative hearts next to header
  drawHeart(ctx, mx + 30, my + 34, 12, accentColor);

  ctx.fillStyle = '#93664C';
  ctx.font = '600 13px system-ui, -apple-system, sans-serif';
  ctx.fillText('DITERBITKAN OLEH: ALHABIB (ABIB)', mx + 42, my + 68);

  // 6. Voucher Title
  ctx.fillStyle = '#2B1713';
  ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
  ctx.fillText(data.title, mx + 42, my + 114);

  // 7. Subtitle / Romantic Commitment
  ctx.fillStyle = '#5C3D2E';
  ctx.font = '15px system-ui, -apple-system, sans-serif';
  ctx.fillText(data.subtitle, mx + 42, my + 146);

  // 8. Dashed Perforated Tear Line
  ctx.strokeStyle = '#F8BBD0';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(mx + 42, my + 178);
  ctx.lineTo(w - mx - 42, my + 178);
  ctx.stroke();
  ctx.setLineDash([]); // Reset line dash

  // 9. Details Grid (Recipient, Issuer, Validity)
  ctx.fillStyle = '#93664C';
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillText('PENERIMA RESMI:', mx + 42, my + 215);
  ctx.fillText('MASA BERLAKU:', mx + 260, my + 215);
  ctx.fillText('TANGGAL KLAIM:', mx + 460, my + 215);

  ctx.fillStyle = '#2B1713';
  ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
  ctx.fillText('Sherly Nabila (Celi)', mx + 42, my + 240);
  ctx.fillText('Seumur Hidup (Anti Expired)', mx + 260, my + 240);
  ctx.fillText(data.claimDate, mx + 460, my + 240);

  // 10. Syarat & Ketentuan Lucu & Romantis
  ctx.fillStyle = '#5C3D2E';
  ctx.font = 'italic 13px system-ui, -apple-system, sans-serif';
  ctx.fillText(
    'Syarat: Cukup kirimkan tiket ini ke WhatsApp Abib (0851-3393-3560). Siap dilayani 24/7 tanpa syarat!',
    mx + 42,
    my + 288
  );

  // 11. Official Stamp Circle on Right
  const stampX = w - mx - 100;
  const stampY = my + 98;
  ctx.save();
  ctx.translate(stampX, stampY);
  ctx.rotate(-0.14);

  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 52, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 46, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = accentColor;
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('· KHUSUS CELI ·', 0, -20);
  ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
  ctx.fillText('100% ASLI', 0, 0);
  ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
  ctx.fillText('DIJAMIN ABIB', 0, 20);

  ctx.restore();

  // 12. Bottom Barcode & Ticket Code
  ctx.fillStyle = '#93664C';
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`KODE TIKET: ${data.code}`, mx + 42, my + 352);

  // Barcode stripes
  ctx.fillStyle = '#2B1713';
  let bx = mx + 42;
  const barWidths = [
    3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 3, 2,
    2, 3, 1, 4, 2
  ];
  for (const bw of barWidths) {
    ctx.fillRect(bx, my + 368, bw, 32);
    bx += bw + 3;
  }

  // 13. Sweet Signature on Bottom Right
  ctx.fillStyle = '#93664C';
  ctx.font = '13px system-ui, -apple-system, sans-serif';
  ctx.fillText('Tertanda dengan penuh sayang,', w - mx - 250, my + 352);
  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
  ctx.fillText('Alhabib (Abib)', w - mx - 250, my + 380);

  // Little cute heart beside Abib's signature
  drawHeart(ctx, w - mx - 120, my + 368, 12, primaryColor);

  return canvas.toDataURL('image/png');
}
