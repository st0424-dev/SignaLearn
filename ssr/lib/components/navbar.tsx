import { CirclePlus, CircleUserRound, House } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <ul className="menu menu-horizontal bg-base-200 rounded-box my-3">
      <li>
        <Link href="/">
          <House size={16} />
          Home
        </Link>
      </li>
      <li>
        <Link href="/create">
          <CirclePlus size={16} />
          Create
        </Link>
      </li>
      <li>
        <Link href="/admin">
          <CircleUserRound size={16} />
          Admin
        </Link>
      </li>
    </ul>
  );
}
