import React from "react";
import styles from "./Wrapper.module.css";
import TabBar from "./TabBar";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.app}>
      <main className={styles.container}>
        <div className={styles.content}>{children}</div>
        <div className={styles.tabBar}>
          <TabBar />
        </div>
      </main>
    </div>
  );
}
