"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faChartSimple,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./TabBar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNavbar() {
  const pathname = usePathname();

  return (
    <div className={styles.container}>
      <Link
        href="/"
        className={`${styles.item} ${pathname == "/" ? styles.active : ""}`}
      >
        <FontAwesomeIcon icon={faHouse} className={styles.icon} />
        <span className={styles.itemName}>Home</span>
      </Link>
      <Link
        href="/learning"
        className={`${styles.item} ${
          pathname == "/learning" ? styles.active : ""
        }`}
      >
        <FontAwesomeIcon icon={faChartSimple} className={styles.icon} />
        <span className={styles.itemName}>Learning</span>
      </Link>
      <Link
        href="/profile"
        className={`${styles.item} ${
          pathname == "/profile" ? styles.active : ""
        }`}
      >
        <FontAwesomeIcon icon={faUser} className={styles.icon} />
        <span className={styles.itemName}>Profile</span>
      </Link>
    </div>
  );
}
