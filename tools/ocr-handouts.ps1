Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Storage.StorageFile, Windows.Storage, ContentType=WindowsRuntime]
$null = [Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation, ContentType=WindowsRuntime]
$null = [Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType=WindowsRuntime]
$null = [Windows.Globalization.Language, Windows.Foundation, ContentType=WindowsRuntime]
$taskMethod = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' } | Select-Object -First 1
function Await-Operation($operation, [Type] $resultType) { $task = $taskMethod.MakeGenericMethod($resultType).Invoke($null, @($operation)); $task.GetAwaiter().GetResult() }
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
if ($null -eq $engine) { throw 'No Windows OCR language available' }
$requests = Get-Content -LiteralPath 'sources/asset-requests.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$result = @{}
foreach ($request in $requests | Where-Object { $_.why -eq 'handout' -and $_.title -notmatch '^DESSIN|^PIERRES|^MAP|^COFFRE' }) {
  $inputPath = Join-Path (Get-Location) ('sources/media/' + $request.id + '.' + $request.ext)
  if (-not (Test-Path -LiteralPath $inputPath)) { $inputPath = 'C:/git/jdr-runeterra/sources/original-assets/' + $request.id + '.' + $request.ext }
  $file = Await-Operation ([Windows.Storage.StorageFile]::GetFileFromPathAsync($inputPath)) ([Windows.Storage.StorageFile])
  $stream = Await-Operation ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
  $decoder = Await-Operation ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
  $bitmap = Await-Operation ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
  $recognized = Await-Operation ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
  $result[$request.id] = @{title=$request.title;text=($recognized.Lines | ForEach-Object Text) -join "`n";method='Windows OCR';verified=$false}
  $bitmap.Dispose(); $stream.Dispose()
}
$result | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath 'sources/transcriptions.json' -Encoding UTF8
Write-Output ('Transcriptions: ' + $result.Count)
