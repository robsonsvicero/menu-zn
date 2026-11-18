'use client';

import { useState } from 'react';
import FloatingBasket from './FloatingBasket';
import BasketDrawer from './BasketDrawer';

type Props = {
  whatsappNumber: string;
};

export default function BasketShell({ whatsappNumber }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <FloatingBasket onClick={() => setOpen(true)} />
      <BasketDrawer
        open={open}
        onClose={() => setOpen(false)}
        whatsappNumber={whatsappNumber}
      />
    </>
  );
}
