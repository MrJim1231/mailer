https://myaccount.google.com/apppasswords

berezhnoioleh@gmail.com
aetm acuc jmer lohx

sitetest544@gmail.com
hfal jera ydaf zsgy

delete sender logi

CREATE TABLE email_history (
id INT AUTO_INCREMENT PRIMARY KEY,
sender_name VARCHAR(255) NOT NULL,
sender_email VARCHAR(255) NOT NULL,
recipient_email VARCHAR(255) NOT NULL,
message TEXT,
send_time DATETIME DEFAULT CURRENT_TIMESTAMP,
status VARCHAR(50)
);
