'use client';

import React from 'react';
import { Breadcrumbs } from '@/components/common';

export default function BreadCrumbsPage() {
    return (
        <Breadcrumbs
            items={[
                { label: 'Produtos' },
            ]}
        />
    );
}
