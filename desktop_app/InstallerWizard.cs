using System;
using System.Drawing;
using System.IO;
using System.Windows.Forms;
using System.Diagnostics;
using Microsoft.Win32;

namespace FerghanaDavomatInstaller
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new InstallerForm());
        }
    }

    public class InstallerForm : Form
    {
        private Panel headerPanel;
        private PictureBox logoBox;
        private Label titleLabel;
        private Label subTitleLabel;
        private Panel contentPanel;
        private Panel footerPanel;
        private Button btnBack;
        private Button btnNext;
        private Button btnCancel;

        private int currentStep = 1;
        private bool isInstalledAlready = false;

        // Step 1 controls (Welcome & Oferta)
        private Label lblStep1Title;
        private RichTextBox rtbOferta;
        private RadioButton rbAccept;
        private RadioButton rbDecline;

        // Step 2 controls (Guide / Instructions)
        private Label lblStep2Title;
        private RichTextBox rtbGuide;

        // Step 3 controls (Path selection)
        private Label lblStep3Title;
        private Label lblPath;
        private TextBox txtInstallPath;
        private Button btnBrowse;

        // Step 4 controls (Progress)
        private Label lblStep4Title;
        private ProgressBar progressBar;
        private Label lblStatus;

        // Step 5 controls (Finish)
        private Label lblStep5Title;
        private Label lblFinishSuccess;
        private CheckBox chkRunApp;

        // Maintenance controls (if already installed)
        private Label lblMaintTitle;
        private RadioButton rbMaintUpdate;
        private RadioButton rbMaintRepair;
        private RadioButton rbMaintUninstall;

        private string defaultInstallDir;
        private string appSourceDir;
        private string appIconPath;

        public InstallerForm()
        {
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.Text = "Ferghana Davomat V1.0 - O'rnatish Oynasi";
            this.Size = new Size(620, 500);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = true;
            this.BackColor = Color.FromArgb(15, 23, 42); // #0f172a
            this.ForeColor = Color.White;

            defaultInstallDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Programs", "FerghanaDavomat");
            appSourceDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "dist", "Ferghana Davomat-win32-x64");
            if (!Directory.Exists(appSourceDir))
            {
                appSourceDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Ferghana Davomat-win32-x64");
            }
            if (!Directory.Exists(appSourceDir))
            {
                appSourceDir = AppDomain.CurrentDomain.BaseDirectory;
            }

            appIconPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "app_icon.ico");
            if (File.Exists(appIconPath))
            {
                try { this.Icon = new Icon(appIconPath); } catch { }
            }

            // Check if already installed
            string exeCheck = Path.Combine(defaultInstallDir, "Ferghana Davomat.exe");
            if (File.Exists(exeCheck))
            {
                isInstalledAlready = true;
            }

            // Header Panel
            headerPanel = new Panel();
            headerPanel.Size = new Size(620, 75);
            headerPanel.Location = new Point(0, 0);
            headerPanel.BackColor = Color.FromArgb(30, 41, 59); // #1e293b

            logoBox = new PictureBox();
            logoBox.Location = new Point(20, 10);
            logoBox.Size = new Size(55, 55);
            logoBox.SizeMode = PictureBoxSizeMode.Zoom;
            string pngPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "app_icon.png");
            if (File.Exists(pngPath))
            {
                try { logoBox.Image = Image.FromFile(pngPath); } catch { }
            }
            headerPanel.Controls.Add(logoBox);

            titleLabel = new Label();
            titleLabel.Text = "Ferghana Davomat & Telegram Desktop";
            titleLabel.Font = new Font("Segoe UI", 12, FontStyle.Bold);
            titleLabel.ForeColor = Color.FromArgb(250, 204, 21); // #facc15
            titleLabel.Location = new Point(85, 14);
            titleLabel.AutoSize = true;
            headerPanel.Controls.Add(titleLabel);

            subTitleLabel = new Label();
            subTitleLabel.Text = "@Ferghanaregdavomat_bot Rasmiy Platformasi O'rnatgichi";
            subTitleLabel.Font = new Font("Segoe UI", 9, FontStyle.Bold);
            subTitleLabel.ForeColor = Color.FromArgb(56, 189, 248); // #38bdf8
            subTitleLabel.Location = new Point(85, 40);
            subTitleLabel.AutoSize = true;
            headerPanel.Controls.Add(subTitleLabel);

            this.Controls.Add(headerPanel);

            // Content Panel
            contentPanel = new Panel();
            contentPanel.Location = new Point(0, 75);
            contentPanel.Size = new Size(620, 325);
            contentPanel.BackColor = Color.FromArgb(15, 23, 42);
            this.Controls.Add(contentPanel);

            // Footer Panel
            footerPanel = new Panel();
            footerPanel.Location = new Point(0, 400);
            footerPanel.Size = new Size(620, 60);
            footerPanel.BackColor = Color.FromArgb(30, 41, 59);

            btnBack = new Button();
            btnBack.Text = "‹ Avvalgi";
            btnBack.Font = new Font("Segoe UI", 9, FontStyle.Bold);
            btnBack.Location = new Point(280, 12);
            btnBack.Size = new Size(95, 34);
            btnBack.FlatStyle = FlatStyle.Flat;
            btnBack.BackColor = Color.FromArgb(51, 65, 85);
            btnBack.ForeColor = Color.White;
            btnBack.Cursor = Cursors.Hand;
            btnBack.Click += BtnBack_Click;
            footerPanel.Controls.Add(btnBack);

            btnNext = new Button();
            btnNext.Text = "Keyingi ›";
            btnNext.Font = new Font("Segoe UI", 9, FontStyle.Bold);
            btnNext.Location = new Point(385, 12);
            btnNext.Size = new Size(110, 34);
            btnNext.FlatStyle = FlatStyle.Flat;
            btnNext.BackColor = Color.FromArgb(2, 132, 199);
            btnNext.ForeColor = Color.White;
            btnNext.Cursor = Cursors.Hand;
            btnNext.Click += BtnNext_Click;
            footerPanel.Controls.Add(btnNext);

            btnCancel = new Button();
            btnCancel.Text = "Bekor qilish";
            btnCancel.Font = new Font("Segoe UI", 9);
            btnCancel.Location = new Point(505, 12);
            btnCancel.Size = new Size(90, 34);
            btnCancel.FlatStyle = FlatStyle.Flat;
            btnCancel.BackColor = Color.FromArgb(71, 85, 105);
            btnCancel.ForeColor = Color.White;
            btnCancel.Cursor = Cursors.Hand;
            btnCancel.Click += (s, e) => { this.Close(); };
            footerPanel.Controls.Add(btnCancel);

            this.Controls.Add(footerPanel);

            // Build Steps
            BuildStep1_Oferta();
            BuildStep2_Guide();
            BuildStep3_Path();
            BuildStep4_Progress();
            BuildStep5_Finish();
            BuildMaintenanceStep();

            if (isInstalledAlready)
            {
                ShowMaintenanceStep();
            }
            else
            {
                ShowStep(1);
            }
        }

        private void KillRunningApp()
        {
            try
            {
                string[] procNames = new string[] { "Ferghana Davomat", "ferghana-davomat-desktop", "electron" };
                foreach (string name in procNames)
                {
                    foreach (Process proc in Process.GetProcessesByName(name))
                    {
                        try
                        {
                            proc.Kill();
                            proc.WaitForExit(1500);
                        }
                        catch { }
                    }
                }
            }
            catch { }
        }

        private void BuildStep1_Oferta()
        {
            lblStep1Title = new Label();
            lblStep1Title.Text = "1-Bosqich: Xush kelibsiz va Ommaviy Oferta shartnomasi";
            lblStep1Title.Font = new Font("Segoe UI", 11, FontStyle.Bold);
            lblStep1Title.ForeColor = Color.FromArgb(248, 250, 252);
            lblStep1Title.Location = new Point(25, 15);
            lblStep1Title.AutoSize = true;

            rtbOferta = new RichTextBox();
            rtbOferta.Location = new Point(25, 45);
            rtbOferta.Size = new Size(555, 185);
            rtbOferta.ReadOnly = true;
            rtbOferta.BackColor = Color.FromArgb(30, 41, 59);
            rtbOferta.ForeColor = Color.FromArgb(226, 232, 240);
            rtbOferta.Font = new Font("Segoe UI", 9);
            rtbOferta.Text =
                "OMMAVIY OFERTA SHARTNOMASI VA FOYDALANISH QOIDALARI\n\n" +
                "1. Ferghana Davomat Desktop platformasidan foydalanish maktablar va mas'ul xodimlar uchun qulay davomat kiritishni ta'minlaydi.\n" +
                "2. Dastur 75% Davomat tizimi va 25% Telegram Desktop oynalaridan iborat bo'lib, xavfsiz va shifrlangan seansda ishlaydi.\n" +
                "3. Dastur internet uzilishini avtomatik aniqlaydi va aloqa tiklanganida ma'lumotlarni qayta sinxronlaydi.\n" +
                "4. Dasturni o'rnatish orqali siz Ommaviy Oferta shartlarini to'liq qabul qilasiz.\n\n" +
                "Mualliflik huquqi: Rustam Ravshanovich hamda Ferghana Davomat Jamoasi © 2026";

            rbAccept = new RadioButton();
            rbAccept.Text = "Men Ommaviy Oferta shartlariga to'liq roziman";
            rbAccept.Font = new Font("Segoe UI", 9.5f, FontStyle.Bold);
            rbAccept.ForeColor = Color.FromArgb(52, 211, 153); // green
            rbAccept.Location = new Point(25, 240);
            rbAccept.AutoSize = true;
            rbAccept.Checked = false; // Disabled by default
            rbAccept.CheckedChanged += (s, e) => {
                if (currentStep == 1) btnNext.Enabled = rbAccept.Checked;
            };

            rbDecline = new RadioButton();
            rbDecline.Text = "Shartlarga rozi emasman";
            rbDecline.Font = new Font("Segoe UI", 9);
            rbDecline.ForeColor = Color.FromArgb(248, 113, 113); // red
            rbDecline.Location = new Point(25, 268);
            rbDecline.Checked = true; // Selected by default -> Next button disabled!
            rbDecline.AutoSize = true;
            rbDecline.CheckedChanged += (s, e) => {
                if (currentStep == 1) btnNext.Enabled = rbAccept.Checked;
            };
        }

        private void BuildStep2_Guide()
        {
            lblStep2Title = new Label();
            lblStep2Title.Text = "2-Bosqich: Dastur Imkoniyatlari va Yo'riqnoma";
            lblStep2Title.Font = new Font("Segoe UI", 11, FontStyle.Bold);
            lblStep2Title.ForeColor = Color.FromArgb(248, 250, 252);
            lblStep2Title.Location = new Point(25, 15);
            lblStep2Title.AutoSize = true;

            rtbGuide = new RichTextBox();
            rtbGuide.Location = new Point(25, 45);
            rtbGuide.Size = new Size(555, 235);
            rtbGuide.ReadOnly = true;
            rtbGuide.BackColor = Color.FromArgb(30, 41, 59);
            rtbGuide.ForeColor = Color.FromArgb(226, 232, 240);
            rtbGuide.Font = new Font("Segoe UI", 9.5f);
            rtbGuide.Text =
                "📌 FERGHANA DAVOMAT DESKTOP DASTURI FOYDALANISH YO'RIQNOMASI:\n\n" +
                "✅ 75% WEB + 25% TELEGRAM SPLIT SCREEN:\n" +
                "Ekran o'rtasidagi resizer chiziq orqali Davomat va Telegram hajmini xohlagancha moslashingiz mumkin.\n\n" +
                "✅ INTERNET ALOQA NAZORATI:\n" +
                "Internet uzilgan holatda ekranda qizil 'Internet uzildi!' ogohlantirishi beriladi. Internet yoqilishi bilan sahifa va ma'lumotlar avtomatik yangilanadi.\n\n" +
                "✅ SHAXSIY SEKSIYA SAQLANISHI:\n" +
                "Dasturni yopib qayta ochsangiz ham Telegram va Davomat parollari saqlanib qoladi.\n\n" +
                "O'rnatishni davom ettirish uchun 'Keyingi' tugmasini bosing.";
        }

        private void BuildStep3_Path()
        {
            lblStep3Title = new Label();
            lblStep3Title.Text = "3-Bosqich: O'rnatish Papkasini Tanlash";
            lblStep3Title.Font = new Font("Segoe UI", 11, FontStyle.Bold);
            lblStep3Title.ForeColor = Color.FromArgb(248, 250, 252);
            lblStep3Title.Location = new Point(25, 15);
            lblStep3Title.AutoSize = true;

            lblPath = new Label();
            lblPath.Text = "Dastur kompyuteringizdagi quyidagi papkaga o'rnatiladi:";
            lblPath.Font = new Font("Segoe UI", 9);
            lblPath.ForeColor = Color.FromArgb(148, 163, 184);
            lblPath.Location = new Point(25, 65);
            lblPath.AutoSize = true;

            txtInstallPath = new TextBox();
            txtInstallPath.Text = defaultInstallDir;
            txtInstallPath.Font = new Font("Segoe UI", 9.5f);
            txtInstallPath.Location = new Point(25, 95);
            txtInstallPath.Size = new Size(450, 30);
            txtInstallPath.BackColor = Color.FromArgb(30, 41, 59);
            txtInstallPath.ForeColor = Color.White;

            btnBrowse = new Button();
            btnBrowse.Text = "Tanlash...";
            btnBrowse.Font = new Font("Segoe UI", 9);
            btnBrowse.Location = new Point(485, 93);
            btnBrowse.Size = new Size(95, 32);
            btnBrowse.FlatStyle = FlatStyle.Flat;
            btnBrowse.BackColor = Color.FromArgb(51, 65, 85);
            btnBrowse.ForeColor = Color.White;
            btnBrowse.Click += (s, e) => {
                using (FolderBrowserDialog fbd = new FolderBrowserDialog())
                {
                    if (fbd.ShowDialog() == DialogResult.OK)
                    {
                        txtInstallPath.Text = Path.Combine(fbd.SelectedPath, "FerghanaDavomat");
                    }
                }
            };
        }

        private void BuildStep4_Progress()
        {
            lblStep4Title = new Label();
            lblStep4Title.Text = "4-Bosqich: O'rnatish Jarayoni";
            lblStep4Title.Font = new Font("Segoe UI", 11, FontStyle.Bold);
            lblStep4Title.ForeColor = Color.FromArgb(248, 250, 252);
            lblStep4Title.Location = new Point(25, 15);
            lblStep4Title.AutoSize = true;

            progressBar = new ProgressBar();
            progressBar.Location = new Point(25, 95);
            progressBar.Size = new Size(555, 32);
            progressBar.Style = ProgressBarStyle.Continuous;

            lblStatus = new Label();
            lblStatus.Text = "Fayllar nusxalanmoqda...";
            lblStatus.Font = new Font("Segoe UI", 9.5f);
            lblStatus.ForeColor = Color.FromArgb(56, 189, 248);
            lblStatus.Location = new Point(25, 140);
            lblStatus.Size = new Size(555, 40);
        }

        private void BuildStep5_Finish()
        {
            lblStep5Title = new Label();
            lblStep5Title.Text = "5-Bosqich: O'rnatish Muvaffaqiyatli Yakunlandi!";
            lblStep5Title.Font = new Font("Segoe UI", 12, FontStyle.Bold);
            lblStep5Title.ForeColor = Color.FromArgb(52, 211, 153); // emerald green
            lblStep5Title.Location = new Point(25, 20);
            lblStep5Title.AutoSize = true;

            lblFinishSuccess = new Label();
            lblFinishSuccess.Text =
                "🎉 Ferghana Davomat kompyuteringizga to'liq va muvaffaqiyatli o'rnatildi!\n\n" +
                "• Ish stolida (Desktop) oltin gerbli rasmiy yorliq yaratildi.\n" +
                "• Start menyusiga dastur qo'shildi.";
            lblFinishSuccess.Font = new Font("Segoe UI", 10);
            lblFinishSuccess.ForeColor = Color.FromArgb(226, 232, 240);
            lblFinishSuccess.Location = new Point(25, 70);
            lblFinishSuccess.Size = new Size(555, 100);

            chkRunApp = new CheckBox();
            chkRunApp.Text = "Dasturni darhol ishga tushirish";
            chkRunApp.Font = new Font("Segoe UI", 10, FontStyle.Bold);
            chkRunApp.ForeColor = Color.FromArgb(250, 204, 21);
            chkRunApp.Checked = true;
            chkRunApp.Location = new Point(25, 190);
            chkRunApp.AutoSize = true;
        }

        private void BuildMaintenanceStep()
        {
            lblMaintTitle = new Label();
            lblMaintTitle.Text = "DIQQAT: Ferghana Davomat kompyuteringizda allaqachon mavjud!";
            lblMaintTitle.Font = new Font("Segoe UI", 11, FontStyle.Bold);
            lblMaintTitle.ForeColor = Color.FromArgb(250, 204, 21);
            lblMaintTitle.Location = new Point(25, 15);
            lblMaintTitle.AutoSize = true;

            rbMaintUpdate = new RadioButton();
            rbMaintUpdate.Text = "1. Yangilash / Qayta o'rnatish (Reinstall / Update)";
            rbMaintUpdate.Font = new Font("Segoe UI", 10, FontStyle.Bold);
            rbMaintUpdate.ForeColor = Color.FromArgb(56, 189, 248);
            rbMaintUpdate.Location = new Point(35, 65);
            rbMaintUpdate.Checked = true;
            rbMaintUpdate.AutoSize = true;

            rbMaintRepair = new RadioButton();
            rbMaintRepair.Text = "2. Qayta tiklash (Missing files & desktop shortcuts)";
            rbMaintRepair.Font = new Font("Segoe UI", 10);
            rbMaintRepair.ForeColor = Color.FromArgb(226, 232, 240);
            rbMaintRepair.Location = new Point(35, 105);
            rbMaintRepair.AutoSize = true;

            rbMaintUninstall = new RadioButton();
            rbMaintUninstall.Text = "3. Dasturni kompyuterdan o'chirish (Uninstall)";
            rbMaintUninstall.Font = new Font("Segoe UI", 10, FontStyle.Bold);
            rbMaintUninstall.ForeColor = Color.FromArgb(248, 113, 113); // red
            rbMaintUninstall.Location = new Point(35, 145);
            rbMaintUninstall.AutoSize = true;
        }

        private void ShowMaintenanceStep()
        {
            contentPanel.Controls.Clear();
            contentPanel.Controls.Add(lblMaintTitle);
            contentPanel.Controls.Add(rbMaintUpdate);
            contentPanel.Controls.Add(rbMaintRepair);
            contentPanel.Controls.Add(rbMaintUninstall);

            btnBack.Visible = false;
            btnNext.Text = "Bajarish ›";
            btnNext.Enabled = true;
            currentStep = 99; // Maintenance step flag
        }

        private void ShowStep(int step)
        {
            currentStep = step;
            contentPanel.Controls.Clear();

            btnBack.Visible = (step > 1 && step < 4);
            btnCancel.Visible = (step < 5);

            if (step == 1)
            {
                contentPanel.Controls.Add(lblStep1Title);
                contentPanel.Controls.Add(rtbOferta);
                contentPanel.Controls.Add(rbAccept);
                contentPanel.Controls.Add(rbDecline);
                btnNext.Text = "Keyingi ›";
                btnNext.Enabled = rbAccept.Checked; // Strictly disabled if not accepted
            }
            else if (step == 2)
            {
                contentPanel.Controls.Add(lblStep2Title);
                contentPanel.Controls.Add(rtbGuide);
                btnNext.Text = "Keyingi ›";
                btnNext.Enabled = true;
            }
            else if (step == 3)
            {
                contentPanel.Controls.Add(lblStep3Title);
                contentPanel.Controls.Add(lblPath);
                contentPanel.Controls.Add(txtInstallPath);
                contentPanel.Controls.Add(btnBrowse);
                btnNext.Text = "O'RNATISH ›";
                btnNext.Enabled = true;
            }
            else if (step == 4)
            {
                contentPanel.Controls.Add(lblStep4Title);
                contentPanel.Controls.Add(progressBar);
                contentPanel.Controls.Add(lblStatus);
                btnBack.Enabled = false;
                btnNext.Enabled = false;
                btnCancel.Enabled = false;

                PerformInstallation();
            }
            else if (step == 5)
            {
                contentPanel.Controls.Add(lblStep5Title);
                contentPanel.Controls.Add(lblFinishSuccess);
                contentPanel.Controls.Add(chkRunApp);
                btnNext.Text = "TUGATISH (FINISH)";
                btnNext.Enabled = true;
            }
        }

        private void BtnNext_Click(object sender, EventArgs e)
        {
            if (currentStep == 99)
            {
                // Handle Maintenance
                if (rbMaintUninstall.Checked)
                {
                    PerformUninstall();
                }
                else
                {
                    ShowStep(1); // Proceed from step 1 (Oferta & Guide)
                }
                return;
            }

            if (currentStep < 5)
            {
                ShowStep(currentStep + 1);
            }
            else if (currentStep == 5)
            {
                if (chkRunApp.Checked)
                {
                    string targetExe = Path.Combine(txtInstallPath.Text, "Ferghana Davomat.exe");
                    if (File.Exists(targetExe))
                    {
                        Process.Start(targetExe);
                    }
                }
                this.Close();
            }
        }

        private void BtnBack_Click(object sender, EventArgs e)
        {
            if (currentStep == 3)
            {
                ShowStep(2);
            }
            else if (currentStep == 2)
            {
                ShowStep(1);
            }
        }

        private void PerformInstallation()
        {
            // First stop any active process so files are not locked
            KillRunningApp();

            Timer installTimer = new Timer();
            installTimer.Interval = 200;
            int stepVal = 0;

            installTimer.Tick += (s, e) =>
            {
                stepVal += 10;
                progressBar.Value = Math.Min(stepVal, 100);

                if (stepVal == 20)
                {
                    lblStatus.Text = "Fayllar va kutubxonalar nusxalanmoqda...";
                    try
                    {
                        string targetDir = txtInstallPath.Text;
                        if (!Directory.Exists(targetDir))
                        {
                            Directory.CreateDirectory(targetDir);
                        }

                        CopyDirectory(appSourceDir, targetDir);
                        if (File.Exists(appIconPath))
                        {
                            File.Copy(appIconPath, Path.Combine(targetDir, "app_icon.ico"), true);
                        }
                        string pngPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "app_icon.png");
                        if (File.Exists(pngPath))
                        {
                            File.Copy(pngPath, Path.Combine(targetDir, "app_icon.png"), true);
                        }
                    }
                    catch (Exception ex)
                    {
                        lblStatus.Text = "Xatolik: " + ex.Message;
                    }
                }
                else if (stepVal == 60)
                {
                    lblStatus.Text = "Ish stolida oltin yorliq (Desktop Shortcut) yaratilmoqda...";
                    try
                    {
                        CreateShortcuts(txtInstallPath.Text);
                    }
                    catch (Exception ex)
                    {
                        lblStatus.Text = "Yorliq yaratishda xatolik: " + ex.Message;
                    }
                }
                else if (stepVal >= 100)
                {
                    installTimer.Stop();
                    ShowStep(5);
                }
            };

            installTimer.Start();
        }

        private void PerformUninstall()
        {
            if (MessageBox.Show("Haqiqatan ham Ferghana Davomat dasturini kompyuteringizdan to'liq o'chirmoqchimisiz?", "O'chirishni tasdiqlang", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes)
            {
                // First kill any active app process to release d3dcompiler_47.dll and other DLL locks
                KillRunningApp();
                System.Threading.Thread.Sleep(500);

                try
                {
                    // Delete Shortcuts
                    string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
                    string deskLnk = Path.Combine(desktopPath, "Ferghana Davomat.lnk");
                    if (File.Exists(deskLnk)) File.Delete(deskLnk);

                    string startMenuPath = Environment.GetFolderPath(Environment.SpecialFolder.Programs);
                    string startLnk = Path.Combine(startMenuPath, "Ferghana Davomat.lnk");
                    if (File.Exists(startLnk)) File.Delete(startLnk);

                    // Delete program folder safely
                    string targetDir = defaultInstallDir;
                    if (Directory.Exists(targetDir))
                    {
                        DeleteDirectoryRecursive(targetDir);
                    }

                    MessageBox.Show("Ferghana Davomat kompyuteringizdan muvaffaqiyatli o'chirildi!", "O'chirildi", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    this.Close();
                }
                catch (Exception ex)
                {
                    MessageBox.Show("O'chirishda xatolik: " + ex.Message + "\n\nIltimos, ishlayotgan dasturni yopib, qayta urinib ko'ring.", "Xatolik", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        private void DeleteDirectoryRecursive(string targetDir)
        {
            string[] files = Directory.GetFiles(targetDir);
            string[] dirs = Directory.GetDirectories(targetDir);

            foreach (string file in files)
            {
                try
                {
                    File.SetAttributes(file, FileAttributes.Normal);
                    File.Delete(file);
                }
                catch { }
            }

            foreach (string dir in dirs)
            {
                DeleteDirectoryRecursive(dir);
            }

            try
            {
                Directory.Delete(targetDir, false);
            }
            catch { }
        }

        private void CopyDirectory(string sourceDir, string targetDir)
        {
            foreach (string dirPath in Directory.GetDirectories(sourceDir, "*", SearchOption.AllDirectories))
            {
                Directory.CreateDirectory(dirPath.Replace(sourceDir, targetDir));
            }

            foreach (string newPath in Directory.GetFiles(sourceDir, "*.*", SearchOption.AllDirectories))
            {
                string destFile = newPath.Replace(sourceDir, targetDir);
                try
                {
                    if (File.Exists(destFile))
                    {
                        File.SetAttributes(destFile, FileAttributes.Normal);
                    }
                    File.Copy(newPath, destFile, true);
                }
                catch { }
            }
        }

        private void CreateShortcuts(string targetDir)
        {
            string exePath = Path.Combine(targetDir, "Ferghana Davomat.exe");
            string icoPath = Path.Combine(targetDir, "app_icon.ico");

            Type shellType = Type.GetTypeFromProgID("WScript.Shell");
            dynamic shell = Activator.CreateInstance(shellType);

            // Desktop Shortcut
            string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
            dynamic deskShortcut = shell.CreateShortcut(Path.Combine(desktopPath, "Ferghana Davomat.lnk"));
            deskShortcut.TargetPath = exePath;
            deskShortcut.WorkingDirectory = targetDir;
            if (File.Exists(icoPath)) deskShortcut.IconLocation = icoPath + ",0";
            deskShortcut.Description = "Ferghana Davomat va Telegram Desktop";
            deskShortcut.Save();

            // Start Menu Shortcut
            string startMenuPath = Environment.GetFolderPath(Environment.SpecialFolder.Programs);
            dynamic startShortcut = shell.CreateShortcut(Path.Combine(startMenuPath, "Ferghana Davomat.lnk"));
            startShortcut.TargetPath = exePath;
            startShortcut.WorkingDirectory = targetDir;
            if (File.Exists(icoPath)) startShortcut.IconLocation = icoPath + ",0";
            startShortcut.Save();
        }
    }
}
