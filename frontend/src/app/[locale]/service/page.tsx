import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import ServiceList from "@/components/containers/service/ServiceList";

const ServicesPage = () => {
    return (
        <Layout header={1} footer={1}>
            <Banner title="Services" />
            <ServiceList />
        </Layout>
    );
};

export default ServicesPage;
