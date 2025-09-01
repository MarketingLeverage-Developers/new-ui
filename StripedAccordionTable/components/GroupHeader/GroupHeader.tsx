import AccordionTable from '@/shared/headless/AccordionTable/AccordionTable';
import React from 'react';

export const GroupHeader = ({ ...props }: React.ComponentProps<typeof AccordionTable.GroupHeader>) => (
    <AccordionTable.GroupHeader {...props} />
);
