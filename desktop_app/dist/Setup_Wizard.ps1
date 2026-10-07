Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

[System.Windows.Forms.Application]::EnableVisualStyles()

# Create Form
$form = New-Object System.Windows.Forms.Form
$form.Text = "Ferghana Davomat V1.0 - O'rnatish Oynasi (Installation Wizard)"
$form.Size = New-Object System.Drawing.Size(580, 430)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = "FixedDialog"
$form.MaximizeBox = $false
$form.BackColor = [System.Drawing.Color]::FromArgb(15, 23, 42)
$form.ForeColor = [System.Drawing.Color]::White

# Logo Picture
$iconPath = Join-Path $PSScriptRoot "app_icon.png"
if (-not (Test-Path $iconPath)) {
    $iconPath = "E:\gemini\projects\davomat_dashboard\davomat_github_ready\desktop_app\app_icon.png"
}
if (Test-Path $iconPath) {
    $imgBox = New-Object System.Windows.Forms.PictureBox
    $imgBox.Image = [System.Drawing.Image]::FromFile($iconPath)
    $imgBox.SizeMode = "Zoom"
    $imgBox.Location = New-Object System.Drawing.Point(30, 20)
    $imgBox.Size = New-Object System.Drawing.Size(64, 64)
    $form.Controls.Add($imgBox)
}

# Title Label
$title = New-Object System.Windows.Forms.Label
$title.Text = "Ferghana Davomat & Telegram Desktop"
$title.Font = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Bold)
$title.ForeColor = [System.Drawing.Color]::FromArgb(250, 204, 21)
$title.Location = New-Object System.Drawing.Point(105, 25)
$title.AutoSize = $true
$form.Controls.Add($title)

# Subtitle Label
$subTitle = New-Object System.Windows.Forms.Label
$subTitle.Text = "@Ferghanaregdavomat_bot Rasmiy Dasturi"
$subTitle.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$subTitle.ForeColor = [System.Drawing.Color]::FromArgb(56, 189, 248)
$subTitle.Location = New-Object System.Drawing.Point(105, 55)
$subTitle.AutoSize = $true
$form.Controls.Add($subTitle)

# Info Label
$info = New-Object System.Windows.Forms.Label
$info.Text = "Ushbu dastur kompyuteringizga Ferghana Davomat platformasini va Telegram Desktop-ni 75%/25% split ekranda o'rnatadi va Ish Stolida oltin rangli rasmiy yorliq (Shortcut) yaratadi."
$info.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$info.ForeColor = [System.Drawing.Color]::FromArgb(203, 213, 225)
$info.Location = New-Object System.Drawing.Point(30, 100)
$info.Size = New-Object System.Drawing.Size(500, 50)
$form.Controls.Add($info)

# Progress Bar
$progress = New-Object System.Windows.Forms.ProgressBar
$progress.Location = New-Object System.Drawing.Point(30, 165)
$progress.Size = New-Object System.Drawing.Size(500, 28)
$progress.Style = "Continuous"
$form.Controls.Add($progress)

# Status Label
$status = New-Object System.Windows.Forms.Label
$status.Text = "O'rnatishni boshlash uchun 'O'RNATISH' tugmasini bosing..."
$status.Font = New-Object System.Drawing.Font("Segoe UI", 9)
$status.ForeColor = [System.Drawing.Color]::FromArgb(148, 163, 184)
$status.Location = New-Object System.Drawing.Point(30, 205)
$status.Size = New-Object System.Drawing.Size(500, 40)
$form.Controls.Add($status)

# Install Button
$installBtn = New-Object System.Windows.Forms.Button
$installBtn.Text = "O'RNATISH (INSTALL)"
$installBtn.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$installBtn.BackColor = [System.Drawing.Color]::FromArgb(2, 132, 199)
$installBtn.ForeColor = [System.Drawing.Color]::White
$installBtn.FlatStyle = "Flat"
$installBtn.Location = New-Object System.Drawing.Point(350, 320)
$installBtn.Size = New-Object System.Drawing.Size(180, 42)
$installBtn.Cursor = [System.Windows.Forms.Cursors]::Hand
$form.Controls.Add($installBtn)

$installBtn.Add_Click({
    $installBtn.Enabled = $false
    $status.Text = "Fayllar nusxalanmoqda va o'rnatilmoqda..."
    $progress.Value = 20

    $targetDir = Join-Path $env:LOCALAPPDATA "Programs\FerghanaDavomat"
    $srcDir = "E:\gemini\projects\davomat_dashboard\davomat_github_ready\desktop_app\dist\Ferghana Davomat-win32-x64"

    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }

    Copy-Item -Path "E:\gemini\projects\davomat_dashboard\davomat_github_ready\desktop_app\dist\Ferghana Davomat-win32-x64\*" -Destination $targetDir -Recurse -Force
    Copy-Item -Path "E:\gemini\projects\davomat_dashboard\davomat_github_ready\desktop_app\app_icon.ico" -Destination "\app_icon.ico" -Force
    Copy-Item -Path "E:\gemini\projects\davomat_dashboard\davomat_github_ready\desktop_app\app_icon.png" -Destination "\app_icon.png" -Force

    $progress.Value = 70
    $status.Text = "Ish stolida oltin yorliq (Desktop Shortcut) yaratilmoqda..."

    # Create Desktop Shortcut with Icon
    $desktopPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
    $shortcutPath = Join-Path $desktopPath "Ferghana Davomat.lnk"
    $exePath = Join-Path $targetDir "Ferghana Davomat.exe"
    $icoPath = Join-Path $targetDir "app_icon.ico"

    $wshell = New-Object -ComObject WScript.Shell
    $shortcut = $wshell.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = $exePath
    $shortcut.IconLocation = "$icoPath,0"
    $shortcut.WorkingDirectory = $targetDir
    $shortcut.Description = "Ferghana Davomat va Telegram Desktop"
    $shortcut.Save()

    # Create Start Menu Shortcut with Icon
    $startMenuPath = Join-Path [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Programs) "Ferghana Davomat.lnk"
    $shortcutStart = $wshell.CreateShortcut($startMenuPath)
    $shortcutStart.TargetPath = $exePath
    $shortcutStart.IconLocation = "$icoPath,0"
    $shortcutStart.WorkingDirectory = $targetDir
    $shortcutStart.Save()

    $progress.Value = 100
    $status.Text = "✅ Muvaffaqiyatli o'rnatildi! Ish stoliga oltin yorliq joylashtirildi."
    
    [System.Windows.Forms.MessageBox]::Show("Ferghana Davomat kompyuteringizga muvaffaqiyatli o'rnatildi!

Ish stolingizda rasmiy oltin gerbli 'Ferghana Davomat' yorlig'i yaratildi.", "Muvaffaqiyatli O'rnatildi", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
    
    Start-Process $exePath
    $form.Close()
})

$form.ShowDialog() | Out-Null
