# AGENTS.md - Ensotek

## 🔔 CODEX AKTİF GÖREVLER (2026-06-26, ensotek_de)
> 🔴 **Analytics tag kurulumu:** [`CODEX-BRIEF-analytics-kurulum.md`](CODEX-BRIEF-analytics-kurulum.md)
> GA4 "veri toplama etkin değil" — `ensotek_de/frontend/src/app/[locale]/layout.tsx` GTM render etmiyor. TEK iş: @next/third-parties ile GTM render (site_settings'ten ID, çift sayım yok). site_settings ZATEN hazır, dokunma.
>
> 🔴 **SEO/İndexleme:** [`CODEX-BRIEF-seo-indexleme.md`](CODEX-BRIEF-seo-indexleme.md)
> GSC: 13 sayfa "URL unknown to Google" (/en+/tr, iç link eksik), 1 Soft 404 (/en/nutzungsbedingungen). FIX 1 iç link/discovery, FIX 2 soft-404 locale fallback, FIX 3 locale↔slug stratejisi (sahip kararı).

## Canli Erisim Notu

Canli server `vps-Ensotek` SSH kisa yolundadir. Key ile sifresiz erisim: `ssh vps-Ensotek`.
