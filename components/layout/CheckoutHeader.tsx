import { FunctionComponent, useContext } from "react";
import SettingsContext from "../../utils/context/SettingsContext";
import styles from "./Layout.module.scss";
import Link from "next/link";

export const CheckoutHeader: FunctionComponent = () => {
  const { currentStage } = useContext(SettingsContext);

  const stages = [
    {
      name: "delivery",
      stage: 1
    },
    {
      name: "payment",
      stage: 2
    },
    {
      name: "done",
      stage: 3
    }
  ];

  return (
    <>
      <header className={styles.header}>
        <Link href="/">
          <a>
            <img
              alt="floral hub logo"
              src="/icons/logo.svg"
              className={styles.logo}
            />
          </a>
        </Link>

        <div className={styles["stage-wrapper"]}>
          <div className="flex center margin-bottom">
            {stages.map((_stage, index) => (
              <div
                key={index}
                className={[
                  styles.progress,
                  currentStage === _stage.stage && styles.active
                ].join(" ")}
              >
                {_stage.stage > 1 && (
                  <hr
                    className={[
                      styles["progress-bar"],
                      currentStage >= _stage.stage && styles.active
                    ].join(" ")}
                  />
                )}
                <span
                  className={[
                    styles.circle,
                    currentStage >= _stage.stage && styles.completed,
                    currentStage === _stage.stage && styles.active
                  ].join(" ")}
                ></span>
              </div>
            ))}
          </div>
          <div className="flex around">
            {stages.map((_stage, index) => (
              <span
                key={index}
                className={[
                  styles["stage-name"],
                  currentStage === _stage.stage && styles.active,
                  currentStage > _stage.stage && styles.completed
                ].join(" ")}
              >
                {_stage.name}
              </span>
            ))}
          </div>
        </div>
      </header>
    </>
  );
};

export default CheckoutHeader;
