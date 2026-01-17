import NavItem from "./NavItem";
import FoldableNavItem from "./FoldableNavItem";
import "/public/agency/assets/css/SidebarNav.css";

export default function SidebarNav({ isCollapsed, onToggle }) {
  // Close sidebar when navigating on mobile
  const handleNavigate = () => {
    if (window.innerWidth <= 991) {
      onToggle();
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      type: "simple",
      href: "agency_dashboard",
      icon: "la la-dashboard",
      label: "Dashboard",
    },
    {
      id: "Manage_locations",
      type: "simple",
      href: "agency_locations",
      icon: "la la-table",
      label: "Manage Locations"
    },
    {
      id: "Manage_Categories",
      type: "simple",
      href: "agency_categories",
      icon: "la la-table",
      label: "Manage Categories"
    },
    {
      id: "Manage_Bookings",
      type: "simple",
      href: "agency_bookings",
      icon: "la la-table",
      label: "Manage Bookings"
    },
    {
      id: "Manage_CustomTours",
      type: "simple",
      href: "agency_custom-tours",
      icon: "la la-table",
      label: "Manage Custom Tours"
    },
    {
      id: "Manage_Hotels",
      type: "simple",
      href: "agency_hotels",
      icon: "la la-table",
      label: "Manage Hotels"
    },
    {
      id: "Manage_Tours",
      type: "simple",
      href: "agency_tours",
      icon: "la la-table",
      label: "Manage Tours"
    },
    {
      id: "Settings",
      type: "simple",
      href: "agency_settings",
      icon: "la la-table",
      label: "Settings"
    }
    
  ];

  return (
    <div className="sidebar">
      <div className="scrollbar-inner sidebar-wrapper">

        <ul className="nav mt-5">
          {menuItems.map((item) => {
            if (item.type === "foldable") {
              return (
                <FoldableNavItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  isActive={false}
                >
                  {item.children?.map((child, index) => (
                    <li key={index}>
                      <a href={child.href}>
                        <span className="link-collapse">{child.label}</span>
                      </a>
                    </li>
                  ))}
                </FoldableNavItem>
              );
            } else {
              return (
                <NavItem
                  key={item.id}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  badge={item.badge}
                  badgeClass={item.badgeClass}
                  isActive={item.id === "dashboard"}
                  onNavigate={handleNavigate}
                />
              );
            }
          })}
        </ul>
      </div>
    </div>
  );
}

