import React, { createContext, useContext, useState } from 'react';

const SofaContext = createContext();

export const SofaProvider = ({ children }) => {
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [customSofaProduct, setCustomSofaProduct] = useState(null);

  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryProduct, setEnquiryProduct] = useState(null);

  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('modal') === 'customize' || params.get('customize') === 'true') {
        setIsCustomizeOpen(true);
      }
      if (params.get('modal') === 'enquire' || params.get('enquire') === 'true') {
        setIsEnquiryOpen(true);
      }
    } catch (e) {}
  }, []);

  const openCustomizeModal = (product = null) => {
    setCustomSofaProduct(product);
    setIsCustomizeOpen(true);
  };

  const closeCustomizeModal = () => {
    setIsCustomizeOpen(false);
    setCustomSofaProduct(null);
  };

  const openEnquiryModal = (product = null) => {
    setEnquiryProduct(product);
    setIsEnquiryOpen(true);
  };

  const closeEnquiryModal = () => {
    setIsEnquiryOpen(false);
    setEnquiryProduct(null);
  };

  return (
    <SofaContext.Provider
      value={{
        isCustomizeOpen,
        customSofaProduct,
        openCustomizeModal,
        closeCustomizeModal,
        isEnquiryOpen,
        enquiryProduct,
        openEnquiryModal,
        closeEnquiryModal,
      }}
    >
      {children}
    </SofaContext.Provider>
  );
};

export const useSofa = () => useContext(SofaContext);
