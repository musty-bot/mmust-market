import * as FileSystem from 'expo-file-system/legacy'
import { Linking, Alert } from 'react-native'

const GITHUB_OWNER = 'musty-bot'
const GITHUB_REPO = 'mmust-market'
const GITHUB_API = 'https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/releases/latest'
const GITHUB_DOWNLOAD_URL = 'https://github.com/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/releases/latest/download'

async function getLatestReleaseDownloadUrl() {
  try {
    const response = await fetch(GITHUB_API, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'MMUST-Market-App',
      },
    })
    if (!response.ok) throw new Error('GitHub API returned ' + response.status)
    const release = await response.json()
    const asset = release.assets?.find(
      (a) => a.name.endsWith('.apk') || a.name.endsWith('.aab')
    )
    if (asset?.browser_download_url) return asset.browser_download_url
    return GITHUB_DOWNLOAD_URL
  } catch (err) {
    console.error('Failed to fetch release info:', err)
    return GITHUB_DOWNLOAD_URL
  }
}

export async function downloadApp(onProgress) {
  try {
    const downloadUrl = await getLatestReleaseDownloadUrl()
    const urlPath = downloadUrl.split('?')[0]
    const fileName = urlPath.split('/').pop() || 'mmust-market.apk'
    const safeName = fileName.endsWith('.apk') ? fileName : fileName + '.apk'
    const downloadDir = FileSystem.documentDirectory
    const destUri = downloadDir + safeName
    const downloadRes = await FileSystem.downloadAsync(downloadUrl, destUri, {
      headers: { 'User-Agent': 'MMUST-Market-App' },
    })
    if (downloadRes.status !== 200) throw new Error('Download failed with status ' + downloadRes.status)
    if (onProgress) onProgress(100)
    return { success: true, uri: downloadRes.uri, fileName: safeName }
  } catch (err) {
    console.error('Download error:', err)
    return { success: false, error: err.message }
  }
}

export async function openDownloadedFile(uri) {
  try {
    await Linking.openURL(uri)
    return true
  } catch (err) {
    console.error('Failed to open file:', err)
    return false
  }
}

export function openGitHubRelease() {
  const url = 'https://github.com/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/releases'
  Linking.openURL(url).catch(() =>
    Alert.alert('Error', 'Could not open releases page.')
  )
}
