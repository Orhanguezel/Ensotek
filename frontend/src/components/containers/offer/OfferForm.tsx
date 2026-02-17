"use client";

import React, { useMemo, useState, FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSubmitOffer } from "@/features/offer/offer.action";
import { useServices } from "@/features/services/services.action";
import { useProducts } from "@/features/products/products.action";

type RelatedType = "general" | "product" | "service";

interface OfferFormProps {
  productId?: string;
  productName?: string;
}

const OfferForm = ({ productId: initialProductId, productName }: OfferFormProps) => {
  const t = useTranslations("ensotek.offer");
  const locale = useLocale();
  const submitOffer = useSubmitOffer();
  
  const [relatedType, setRelatedType] = useState<RelatedType>(initialProductId ? "product" : "general");
  const [selectedProductId, setSelectedProductId] = useState(initialProductId || "");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  
  // Basic Info
  const [companyName, setCompanyName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  
  // Technical Info (for form_data)
  const [towerProcess, setTowerProcess] = useState("");
  const [towerCity, setTowerCity] = useState("");
  const [waterFlow, setWaterFlow] = useState("");
  const [inletTemp, setInletTemp] = useState("");
  const [outletTemp, setOutletTemp] = useState("");
  const [wetBulbTemp, setWetBulbTemp] = useState("");
  const [capacity, setCapacity] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  
  // Consent
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data: productsData } = useProducts({ limit: 100 });
  const { data: servicesData } = useServices();

  const products = productsData?.data || [];
  const services = servicesData || [];

  const handleTypeChange = (type: RelatedType) => {
    setRelatedType(type);
    if (type !== "product") setSelectedProductId("");
    if (type !== "service") setSelectedServiceId("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!consentTerms) {
      setError(t("acceptTermsError") || "Please accept the privacy terms.");
      return;
    }

    const payload = {
      customer_name: customerName,
      company_name: companyName,
      email,
      phone,
      country_code: country, // Backend expects ISO2 but we'll send what user typed and handle it in backend or just use raw in form_data
      locale,
      subject: `Offer Request - ${relatedType.toUpperCase()}`,
      message: extraNotes,
      product_id: relatedType === "product" ? selectedProductId : undefined,
      consent_marketing: consentMarketing,
      consent_terms: consentTerms,
      form_data: {
        related_type: relatedType,
        service_id: relatedType === "service" ? selectedServiceId : undefined,
        tower_process: towerProcess,
        tower_city: towerCity,
        water_flow: waterFlow,
        inlet_temp: inletTemp,
        outlet_temp: outletTemp,
        wet_bulb_temp: wetBulbTemp,
        capacity: capacity,
        notes: extraNotes
      }
    };

    try {
      await submitOffer.mutateAsync(payload as any);
      setSuccess(t("successMessage") || "Your offer request has been sent successfully.");
      // Reset form
      setCustomerName("");
      setCompanyName("");
      setEmail("");
      setPhone("");
      setCountry("");
      setExtraNotes("");
      setTowerProcess("");
      setTowerCity("");
      setWaterFlow("");
      setInletTemp("");
      setOutletTemp("");
      setWetBulbTemp("");
      setCapacity("");
    } catch (err) {
      setError(t("errorMessage") || "An error occurred while sending your request.");
    }
  };

  return (
    <div className="touch__contact p-relative">
      <div className="touch__carcle"></div>
      <div className="touch__content-title">
        <h3>{t("technicalDetails") || "Technical Details"}</h3>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Section 1: Contact Info */}
          <div className="col-12 mb-20">
            <h4 className="mb-20 border-bottom pb-2">{t("contactInfo") || "Contact Information"}</h4>
          </div>
          
          <div className="col-md-6">
            <div className="touch__input">
              <input 
                type="text" 
                placeholder={t("company") || "Company Name"} 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="touch__input">
              <input 
                type="text" 
                placeholder={t("contactPerson") || "Contact Person"} 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="touch__input">
              <input 
                type="email" 
                placeholder={t("email") || "Email Address"} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="touch__input">
              <input 
                type="tel" 
                placeholder={t("phone") || "Phone Number"} 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="col-md-12">
            <div className="touch__input">
              <input 
                type="text" 
                placeholder={t("country") || "Country"} 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          {/* Section 2: Request Type */}
          <div className="col-12 mt-30 mb-20">
            <h4 className="mb-20 border-bottom pb-2">{t("requestType") || "Request Type"}</h4>
            <div className="d-flex gap-4 flex-wrap mb-20">
              <div className="form-check">
                <input 
                  className="form-check-input e-check-input" 
                  type="radio" 
                  id="type-general" 
                  name="request_type"
                  checked={relatedType === "general"} 
                  onChange={() => handleTypeChange("general")}
                />
                <label className="form-check-label ms-2" htmlFor="type-general">
                  {t("generalQuote") || "General Quote"}
                </label>
              </div>
              <div className="form-check">
                <input 
                  className="form-check-input e-check-input" 
                  type="radio" 
                  id="type-product" 
                  name="request_type"
                  checked={relatedType === "product"}
                  onChange={() => handleTypeChange("product")}
                />
                <label className="form-check-label ms-2" htmlFor="type-product">
                  {t("product") || "Product / Spare Part"}
                </label>
              </div>
              <div className="form-check">
                <input 
                  className="form-check-input e-check-input" 
                  type="radio" 
                  id="type-service" 
                  name="request_type"
                  checked={relatedType === "service"}
                  onChange={() => handleTypeChange("service")}
                />
                <label className="form-check-label ms-2" htmlFor="type-service">
                  {t("service") || "Service / Engineering"}
                </label>
              </div>
            </div>
          </div>

          {relatedType === "product" && (
             <div className="col-12 mb-20">
                <div className="contact__select">
                    <select 
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        required
                    >
                        <option value="">{t("selectProduct") || "Select a Product"}</option>
                        {products.map((p: any) => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                    </select>
                </div>
             </div>
          )}

          {relatedType === "service" && (
             <div className="col-12 mb-20">
                <div className="contact__select">
                    <select 
                        value={selectedServiceId}
                        onChange={(e) => setSelectedServiceId(e.target.value)}
                        required
                    >
                        <option value="">{t("selectService") || "Select a Service"}</option>
                        {services.map((s: any) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
             </div>
          )}

          {/* Section 3: Technical Details Fields */}
          <div className="col-md-6">
            <div className="touch__input">
              <input 
                type="text" 
                placeholder={t("towerProcess") || "Process Type"} 
                value={towerProcess}
                onChange={(e) => setTowerProcess(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="touch__input">
              <input 
                type="text" 
                placeholder={t("towerCity") || "City / Location"} 
                value={towerCity}
                onChange={(e) => setTowerCity(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="touch__input">
              <input 
                type="text" 
                placeholder={t("waterFlow") || "Water Flow (m³/h)"} 
                value={waterFlow}
                onChange={(e) => setWaterFlow(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="touch__input">
              <input 
                type="text" 
                placeholder={t("inletTemp") || "Inlet Temp (°C)"} 
                value={inletTemp}
                onChange={(e) => setInletTemp(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="touch__input">
              <input 
                type="text" 
                placeholder={t("outletTemp") || "Outlet Temp (°C)"} 
                value={outletTemp}
                onChange={(e) => setOutletTemp(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="touch__input">
              <input 
                type="text" 
                placeholder={t("wetBulbTemp") || "Wet Bulb Temp (°C)"} 
                value={wetBulbTemp}
                onChange={(e) => setWetBulbTemp(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="touch__input">
              <input 
                type="text" 
                placeholder={t("capacity") || "Capacity (kcal/h or kW)"} 
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12">
            <div className="touch__input">
              <textarea 
                placeholder={t("notes") || "Additional Notes / Requirements"} 
                value={extraNotes}
                onChange={(e) => setExtraNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* Section 4: Consent & Submit */}
          <div className="col-12 mt-10">
            <div className="sign__check mb-10">
              <input 
                className="e-check-input" 
                type="checkbox" 
                id="consent-terms" 
                checked={consentTerms}
                onChange={(e) => setConsentTerms(e.target.checked)}
                required
              />
              <label className="ms-2 small" htmlFor="consent-terms">
                {t("consentTerms") || "I have read and accept the privacy policy and terms of use."}
              </label>
            </div>
            <div className="sign__check mb-30">
              <input 
                className="e-check-input" 
                type="checkbox" 
                id="consent-marketing" 
                checked={consentMarketing}
                onChange={(e) => setConsentMarketing(e.target.checked)}
              />
              <label className="ms-2 small" htmlFor="consent-marketing">
                {t("consentMarketing") || "I would like to receive informational emails about new products."}
              </label>
            </div>

            {error && <div className="alert alert-danger mb-20">{error}</div>}
            {success && <div className="alert alert-success mb-20">{success}</div>}

            <div className="touch__submit">
              <button 
                type="submit" 
                className="border__btn w-100" 
                disabled={submitOffer.isPending}
              >
                {submitOffer.isPending ? t("common.loading") : t("submit") || "Request an Offer"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OfferForm;
