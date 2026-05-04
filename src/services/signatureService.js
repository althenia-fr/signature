const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export async function fetchSigningRecord(token) {
  const normalizedToken = encodeURIComponent(token)
  const response = await fetch(`${API_BASE_URL}/signature/get?token=${normalizedToken}`, {
    headers: {
      'Accept': 'application/json'
    }
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Jeton introuvable ou lien de signature invalide.')
    }

    const message = await response.text().catch(() => '')
    throw new Error(message || 'Unable to load signing record from the backend.')
  }

  const text = await response.text()
  let data
  try {
    data = JSON.parse(text)
  } catch (err) {
    throw new Error('Réponse serveur invalide, le jeton ou le service peut être incorrect.')
  }

  return data
}

export async function submitSignature(token, signatureJpgDataUrl) {
  const response = await fetch(`${API_BASE_URL}/signature/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token,
      signature: signatureJpgDataUrl
    })
  })

  if (!response.ok) {
    const message = await response.text().catch(() => '')
    throw new Error(message || 'Unable to submit the signature.')
  }

  const text = await response.text()
  let data
  try {
    data = JSON.parse(text)
  } catch (err) {
    throw new Error('Réponse serveur invalide lors de l’envoi de la signature.')
  }

  return data
}
