'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../../../styles/pos.module.css';
import { usePOSStore } from '../../../lib/store';

export default function SettingsPage() {
  const store = usePOSStore();
  const [name, setName] = useState(store.partnerName);
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState<number>(0);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Link href="/pos" className={styles.back}>POS</Link>
        <h1 className={styles.title}>POS Settings</h1>
        <div/>
      </header>

      <div className={styles.settingsContainer}>
        <div className={styles.settingsRow}>
          <section className={styles.settingsSection}>
            <h2>Partner Name</h2>
            <div className={styles.row}> 
              <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Watercoin Makmur" />
              <button className={styles.primary} onClick={() => store.setPartnerName(name)}>Save</button>
            </div>
          </section>

          <section className={styles.settingsSection}>
            <h2>Add Item</h2>
            <div className={styles.row}>
              <input className={styles.input} value={itemName} onChange={e => setItemName(e.target.value)} placeholder="Item Name" />
              <input className={styles.input} type="number" value={price} onChange={e => setPrice(parseInt(e.target.value || '0'))} placeholder="Price" />
              <button className={styles.primary}
                onClick={() => { if (itemName && price > 0) { store.addProduct({ id: crypto.randomUUID(), name: itemName, price }); setItemName(''); setPrice(0);} }}>Add</button>
            </div>
          </section>
        </div>

        <div className={styles.settingsRow}>
          <section className={styles.settingsSection}>
            <h2>Products</h2>
            <ul className={styles.list}>
              {store.products.map(p => (
                <li key={p.id} className={styles.listItem}>
                  <span>{p.name}</span>
                  <span>Rp {p.price.toLocaleString('id-ID')}</span>
                  <button className={styles.secondary} onClick={() => store.removeProduct(p.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.settingsSection}>
            <h2>Export & Statistics</h2>
            <div className={styles.row}>
              <button className={styles.secondary} onClick={() => store.exportWeeklyCsv()}>Download Weekly CSV</button>
              <button className={styles.secondary} onClick={() => store.generateWeeklyReport()}>View Chart</button>
            </div>
            <div id="chart-root" className={styles.chartRoot}></div>
          </section>
        </div>
      </div>
    </div>
  );
}


