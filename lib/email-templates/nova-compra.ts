export function novaCompraTemplate({
  nome,
  email,
  plano,
  data,
}: {
  nome: string;
  email: string;
  plano: string;
  data: string;
}) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nova compra recebida</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f0e8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0e8;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background-color:#cfee9a;padding:24px 32px;">
              <p style="margin:0;font-size:13px;color:#1a1a1a;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Nova compra recebida</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 28px;">
              <p style="margin:0 0 24px;font-size:15px;color:#333333;line-height:1.6;">
                Uma nova compra foi registrada na plataforma. Confira os detalhes abaixo:
              </p>

              <!-- Details box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0e8;border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 8px;font-size:15px;color:#1a1a1a;">
                      <strong>Nome:</strong> ${nome}
                    </p>
                    <p style="margin:0 0 8px;font-size:15px;color:#1a1a1a;">
                      <strong>E-mail:</strong> ${email}
                    </p>
                    <p style="margin:0 0 8px;font-size:15px;color:#1a1a1a;">
                      <strong>Plano:</strong> ${plano}
                    </p>
                    <p style="margin:0;font-size:15px;color:#1a1a1a;">
                      <strong>Data:</strong> ${data}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a
                      href="https://atlantica.lojah.app/admin/vendedores"
                      style="display:inline-block;background-color:#1a1a1a;color:#cfee9a;font-size:15px;font-weight:bold;text-decoration:none;padding:14px 36px;border-radius:8px;"
                    >
                      Ver vendedores
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #eeeeee;">
              <p style="margin:0;font-size:12px;color:#aaaaaa;text-align:center;">
                Este é um e-mail automático, não responda.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
