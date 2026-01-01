import React from 'react';
import Banner from '@/layout/banner/Breadcrum';
import TechnicalArea from '@/components/containers/cta/TechnicalArea';
import TechnicalProject from '@/components/containers/projects/Project';

const TechnicalPage = () => {
  return (
    <>
      <Banner title="Technical SEO" />
      <TechnicalArea />
      <TechnicalProject />
    </>
  );
};

export default TechnicalPage;
