'use client';
import Image from 'next/image';
import LogoColetek from '../../assets/img/logo_coletek.png';

export default function Logo({ onClick }: { onClick: () => void }) {
  return (
    <div style={{ cursor: 'pointer' }} onClick={onClick} aria-label="Ir para a home">
      <Image src={LogoColetek} alt="Logo Coletek" priority />
    </div>
  );
}
