import AccordionTable from '@/shared/headless/AccordionTable/AccordionTable';
import React from 'react';

export const ColGroup = (props: React.ComponentProps<typeof AccordionTable.ColGroup>) => (
    <AccordionTable.ColGroup {...props} />
);
