import React from "react";

export type ApiSettingsTabProps = {
  locale: string;
};

export const ApiSettingsTab: React.FC<ApiSettingsTabProps> = ({
  locale,
}) => {
  return (
    <div className="card">
      <div className="card-header py-2 d-flex justify-content-between align-items-center">
        <span className="small fw-semibold">API & Entegrasyon Ayarları</span>
        <span className="badge bg-light text-dark border">
          Bu bölüm genellikle dillere göre değişmez
        </span>
      </div>
      <div className="card-body">
        <p className="text-muted small mb-3">
          Buraya Google Analytics, Facebook Pixel, Telegram bot token, Discord
          webhook vb. üçüncü parti entegrasyonlar için form gelecek.
        </p>
      </div>
    </div>
  );
};
