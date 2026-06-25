export function gerarPayloadPix({
  chave,
  nome,
  cidade,
  valor,
  descricao,
}: {
  chave: string
  nome: string
  cidade: string
  valor: number
  descricao: string
}): string {
  function campo(id: string, valor: string) {
    const len = valor.length.toString().padStart(2, "0")
    return `${id}${len}${valor}`
  }

  const pixKey = campo("01", chave)
  const pixDescription = campo("02", descricao.substring(0, 72))
  const merchantAccountInfo = campo("00", "BR.GOV.BCB.PIX") + pixKey + pixDescription
  const merchantAccountInfoFull = campo("26", merchantAccountInfo)

  const valorStr = valor.toFixed(2)
  const valorField = campo("54", valorStr)

  let payload =
    campo("00", "01") +
    merchantAccountInfoFull +
    campo("52", "0000") +
    campo("53", "986") +
    valorField +
    campo("58", "BR") +
    campo("59", nome.substring(0, 25)) +
    campo("60", cidade.substring(0, 15)) +
    campo("62", campo("05", "***"))

  // CRC16
  payload += "6304"
  const crc = crc16(payload)
  return payload + crc.toString(16).toUpperCase().padStart(4, "0")
}

function crc16(str: string): number {
  let crc = 0xffff
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
    }
  }
  return crc & 0xffff
}
