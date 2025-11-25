"use client";

const IconContract = ({ className }: { className?: string }) => (
  <svg
    width="18"
    height="24"
    viewBox="0 0 18 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_793_22789)">
      <path
        d="M3 0C1.34531 0 0 1.34531 0 3V21C0 22.6547 1.34531 24 3 24H15C16.6547 24 18 22.6547 18 21V7.5H12C11.1703 7.5 10.5 6.82969 10.5 6V0H3ZM12 0V6H18L12 0ZM3.75 3H6.75C7.1625 3 7.5 3.3375 7.5 3.75C7.5 4.1625 7.1625 4.5 6.75 4.5H3.75C3.3375 4.5 3 4.1625 3 3.75C3 3.3375 3.3375 3 3.75 3ZM3.75 6H6.75C7.1625 6 7.5 6.3375 7.5 6.75C7.5 7.1625 7.1625 7.5 6.75 7.5H3.75C3.3375 7.5 3 7.1625 3 6.75C3 6.3375 3.3375 6 3.75 6ZM6.29062 17.8969C6.00469 18.8484 5.12812 19.5 4.13437 19.5H3.75C3.3375 19.5 3 19.1625 3 18.75C3 18.3375 3.3375 18 3.75 18H4.13437C4.46719 18 4.75781 17.7844 4.85156 17.4656L5.55 15.1453C5.70937 14.6156 6.19688 14.25 6.75 14.25C7.30312 14.25 7.79063 14.6109 7.95 15.1453L8.49375 16.9547C8.84062 16.6641 9.28125 16.5 9.75 16.5C10.4953 16.5 11.175 16.9219 11.5078 17.5875L11.7141 18H14.25C14.6625 18 15 18.3375 15 18.75C15 19.1625 14.6625 19.5 14.25 19.5H11.25C10.9641 19.5 10.7063 19.3406 10.5797 19.0875L10.1672 18.2578C10.0875 18.0984 9.92813 18 9.75469 18C9.58125 18 9.41719 18.0984 9.34219 18.2578L8.92969 19.0875C8.79375 19.3641 8.49844 19.5281 8.19375 19.5C7.88906 19.4719 7.62656 19.2609 7.54219 18.9703L6.75 16.3594L6.29062 17.8969Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_793_22789">
        <path d="M0 0H18V24H0V0Z" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const IconSafety = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_793_22783)">
      <path
        d="M12 0C12.2156 0 12.4313 0.046875 12.6281 0.135938L21.4547 3.88125C22.486 4.31719 23.2547 5.33438 23.25 6.5625C23.2266 11.2125 21.3141 19.7203 13.2375 23.5875C12.4547 23.9625 11.5453 23.9625 10.7625 23.5875C2.68596 19.7203 0.773459 11.2125 0.750021 6.5625C0.745334 5.33438 1.51408 4.31719 2.54533 3.88125L11.3766 0.135938C11.5688 0.046875 11.7844 0 12 0ZM12 3.13125V20.85C18.4688 17.7188 20.2078 10.7859 20.25 6.62813L12 3.13125Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_793_22783">
        <path d="M0 0H24V24H0V0Z" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

type KPIListItem = {
  label: string;
  value?: string;
  variant?: "danger" | "warning" | "success" | "info";
  icon?: "warning" | "graduate" | "check";
};

const IconWarning = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_657_26476)">
      <path
        d="M8.00007 1C8.44382 1 8.85319 1.23437 9.07819 1.61875L15.8282 13.1187C16.0563 13.5062 16.0563 13.9844 15.8344 14.3719C15.6126 14.7594 15.1969 15 14.7501 15H1.25007C0.803192 15 0.387567 14.7594 0.165692 14.3719C-0.0561827 13.9844 -0.0530577 13.5031 0.171942 13.1187L6.92194 1.61875C7.14694 1.23437 7.55632 1 8.00007 1ZM8.00007 5C7.58444 5 7.25007 5.33437 7.25007 5.75V9.25C7.25007 9.66562 7.58444 10 8.00007 10C8.41569 10 8.75007 9.66562 8.75007 9.25V5.75C8.75007 5.33437 8.41569 5 8.00007 5ZM9.00007 12C9.00007 11.7348 8.89471 11.4804 8.70717 11.2929C8.51964 11.1054 8.26528 11 8.00007 11C7.73485 11 7.4805 11.1054 7.29296 11.2929C7.10542 11.4804 7.00007 11.7348 7.00007 12C7.00007 12.2652 7.10542 12.5196 7.29296 12.7071C7.4805 12.8946 7.73485 13 8.00007 13C8.26528 13 8.51964 12.8946 8.70717 12.7071C8.89471 12.5196 9.00007 12.2652 9.00007 12Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_657_26476">
        <path d="M0 0H16V16H0V0Z" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const IconGraduate = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="16"
    viewBox="0 0 20 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_657_26479)">
      <path
        d="M9.99999 1C9.74687 1 9.49687 1.04375 9.25937 1.12812L0.493743 4.29375C0.196868 4.40312 -7.27281e-06 4.68438 -7.27281e-06 5C-7.27281e-06 5.31563 0.196868 5.59688 0.493743 5.70625L2.30312 6.35938C1.79062 7.16563 1.49999 8.11875 1.49999 9.12187V10C1.49999 10.8875 1.16249 11.8031 0.803118 12.525C0.599993 12.9312 0.368743 13.3313 0.0999927 13.7C-7.27177e-06 13.8344 -0.0281323 14.0094 0.0281177 14.1687C0.0843677 14.3281 0.215618 14.4469 0.378118 14.4875L2.37812 14.9875C2.50937 15.0219 2.64999 14.9969 2.76562 14.925C2.88124 14.8531 2.96249 14.7344 2.98749 14.6C3.25624 13.2625 3.12187 12.0625 2.92187 11.2031C2.82187 10.7594 2.68749 10.3062 2.49999 9.89062V9.12187C2.49999 8.17812 2.81874 7.2875 3.37187 6.575C3.77499 6.09062 4.29687 5.7 4.90937 5.45937L9.81562 3.53125C10.0719 3.43125 10.3625 3.55625 10.4625 3.8125C10.5625 4.06875 10.4375 4.35938 10.1812 4.45937L5.27499 6.3875C4.88749 6.54062 4.54687 6.775 4.26874 7.0625L9.25624 8.8625C9.49374 8.94688 9.74374 8.99063 9.99687 8.99063C10.25 8.99063 10.5 8.94688 10.7375 8.8625L19.5062 5.70625C19.8031 5.6 20 5.31563 20 5C20 4.68438 19.8031 4.40312 19.5062 4.29375L10.7406 1.12812C10.5031 1.04375 10.2531 1 9.99999 1ZM3.99999 12.75C3.99999 13.8531 6.68749 15 9.99999 15C13.3125 15 16 13.8531 16 12.75L15.5219 8.20625L11.0781 9.8125C10.7312 9.9375 10.3656 10 9.99999 10C9.63437 10 9.26562 9.9375 8.92187 9.8125L4.47812 8.20625L3.99999 12.75Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_657_26479">
        <path d="M0 0H20V16H0V0Z" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const IconCheck = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_657_26482)">
      <path
        d="M8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 10.1217 0.842855 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16ZM11.5312 6.53125L7.53125 10.5312C7.2375 10.825 6.7625 10.825 6.47188 10.5312L4.47188 8.53125C4.17813 8.2375 4.17813 7.7625 4.47188 7.47188C4.76562 7.18125 5.24062 7.17813 5.53125 7.47188L7 8.94063L10.4688 5.46875C10.7625 5.175 11.2375 5.175 11.5281 5.46875C11.8187 5.7625 11.8219 6.2375 11.5281 6.52812L11.5312 6.53125Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_657_26482">
        <path d="M0 0H16V16H0V0Z" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const getIconComponent = (icon?: string) => {
  switch (icon) {
    case "warning":
      return IconWarning;
    case "graduate":
      return IconGraduate;
    case "check":
      return IconCheck;
    default:
      return null;
  }
};

type KPICardProps = {
  title: string;
  icon: "contract" | "safety";
  highlight: {
    label: string;
    description: string;
    value: string;
    variant: "danger" | "warning" | "success" | "info";
  };
  items: KPIListItem[];
};

const getHeaderIcon = (icon: "contract" | "safety") => {
  switch (icon) {
    case "contract":
      return IconContract;
    case "safety":
      return IconSafety;
  }
};

export function KPICard({ title, icon, highlight, items }: KPICardProps) {
  return (
    <div className="rounded-3xl border border-border bg-bg-surface p-6 dark:border-dark-border dark:bg-dark-bg-surface">
      <header className="flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center text-brand-primary dark:text-blue-400">
          {(() => {
            const IconComponent = getHeaderIcon(icon);
            return <IconComponent className="h-6 w-6" />;
          })()}
        </div>
        <h2 className="mb-0! text-xl font-semibold text-text-strong dark:text-dark-text-strong">
          {title}
        </h2>
      </header>

      <div className="mt-4 rounded-2xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-text-strong dark:text-dark-text-strong">
              {highlight.label}
            </p>
            <p className="text-sm text-text-subtle">{highlight.description}</p>
          </div>
          <span
            className={`font-bold text-xl ${
              highlight.variant === "success"
                ? "text-green-600 dark:text-green-400"
                : highlight.variant === "danger"
                  ? "text-red-600 dark:text-red-400"
                  : highlight.variant === "warning"
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-brand-primary"
            }`}
          >
            {highlight.value}
          </span>
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        {items.map((item) => {
          const getBackgroundColor = () => {
            switch (item.variant) {
              case "danger":
                return "bg-red-50 dark:bg-red-950/20";
              case "warning":
                return "bg-orange-50 dark:bg-orange-950/20";
              case "success":
                return "bg-green-50 dark:bg-green-950/20";
              default:
                return "bg-bg-subtle dark:bg-dark-bg-surface";
            }
          };

          return (
            <li
              key={item.label}
              className={`flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm dark:border-dark-border ${getBackgroundColor()}`}
            >
              <div className="flex items-center gap-3">
                {item.icon &&
                  (() => {
                    const IconComponent = getIconComponent(item.icon);
                    const valueColorClass =
                      item.variant === "success"
                        ? "text-green-600 dark:text-green-400"
                        : item.variant === "danger"
                          ? "text-red-600 dark:text-red-400"
                          : item.variant === "warning"
                            ? "text-orange-600 dark:text-orange-400"
                            : "text-brand-primary";

                    return IconComponent ? (
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center ${valueColorClass}`}
                      >
                        <IconComponent className="h-full w-full" />
                      </div>
                    ) : null;
                  })()}
                <span className="text-text-strong dark:text-dark-text-strong">{item.label}</span>
              </div>
              {item.value && (
                <span
                  className={`font-semibold ${
                    item.variant === "success"
                      ? "text-green-600 dark:text-green-400"
                      : item.variant === "danger"
                        ? "text-red-600 dark:text-red-400"
                        : item.variant === "warning"
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-brand-primary"
                  }`}
                >
                  {item.value}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
