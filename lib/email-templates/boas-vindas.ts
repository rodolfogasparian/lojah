export function boasVindasTemplate({
  nome,
  email,
  senha,
  painelUrl,
}: {
  nome: string;
  email: string;
  senha: string;
  painelUrl: string;
}) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Seu acesso está pronto!</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f0e8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0e8;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#1a1a1a;padding:32px 24px;">
              <img
                src="https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/logo-atlantica-fundo-preto.jpg"
                alt="Atlântica Natural"
                width="72"
                height="72"
                style="border-radius:10px;display:block;margin:0 auto 12px;"
              />
              <p style="margin:0;color:#cfee9a;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Atlântica Natural</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px 32px;">
              <h1 style="margin:0 0 8px;font-size:22px;color:#1a1a1a;">Seu acesso está pronto!</h1>
              <p style="margin:0 0 28px;font-size:15px;color:#555555;line-height:1.6;">
                Olá, <strong>${nome}</strong>! Sua conta no catálogo Atlântica Natural foi criada. Use as credenciais abaixo para acessar o seu painel.
              </p>

              <!-- Credentials box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0e8;border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 10px;font-size:13px;color:#888888;text-transform:uppercase;letter-spacing:0.5px;">Dados de acesso</p>
                    <p style="margin:0 0 6px;font-size:15px;color:#1a1a1a;">
                      <strong>E-mail:</strong> ${email}
                    </p>
                    <p style="margin:0;font-size:15px;color:#1a1a1a;">
                      <strong>Senha:</strong> ${senha}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a
                      href="${painelUrl}"
                      style="display:inline-block;background-color:#cfee9a;color:#1a1a1a;font-size:15px;font-weight:bold;text-decoration:none;padding:14px 36px;border-radius:8px;"
                    >
                      Acessar meu painel
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
