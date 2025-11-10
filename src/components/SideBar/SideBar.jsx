import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getDailyMeals } from "../../redux/products/products-operations";
import DiaryDateCalendar from "../DiaryDateCalendar/DiaryDateCalendar";
import s from "./SideBar.module.css";

const SideBar = () => {
  const { dailyMeals, date } = useSelector((state) => state.products);
  const { userDailyDiet } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // 🔄 Încarcă mesele pentru data selectată
  useEffect(() => {
    if (!date) return;
    dispatch(getDailyMeals({ date }));
  }, [dispatch, date]);

  // 📊 Datele despre dietă (de la calculator)
  const notAllowed = userDailyDiet?.notAllowedProduct || [];

  const summary = useMemo(() => {
    if (!userDailyDiet?.calories) return null;

    const dailyCalories = Number(userDailyDiet.calories) || 0;

    const consumed = (dailyMeals || []).reduce(
      (total, meal) => total + (meal.calories || 0),
      0
    );

    const leftRaw = dailyCalories - consumed;
    const left = leftRaw <= 0 ? 0 : leftRaw;

    const percent = dailyCalories > 0 ? (consumed * 100) / dailyCalories : 0;

    return {
      dailyCalories: dailyCalories.toFixed(1),
      consumed: consumed.toFixed(1),
      left: left.toFixed(1),
      percent: percent.toFixed(2),
    };
  }, [userDailyDiet, dailyMeals]);

  const hasDietInfo = !!userDailyDiet?.calories && notAllowed.length > 0;
  const hasDailyMeals = summary && (dailyMeals?.length || 0) > 0;

  return (
    <div className={s.sideBar}>
      <div className={s.box}>
        {/* ========= SUMMARY ========= */}
        <section className={s.section}>
          <h2 className={s.title}>
            Summary for <DiaryDateCalendar location="sidebar" />
          </h2>

          {!summary && (
            <p>
              Please fill out the form on the Calculator page to see your
              personal statistics.
            </p>
          )}

          {summary && (
            <ul className={s.list}>
              <li className={s.item}>
                <p>Left</p>
                <p>{hasDailyMeals ? summary.left : "000"} kcal</p>
              </li>
              <li className={s.item}>
                <p>Consumed</p>
                <p>{hasDailyMeals ? summary.consumed : "000"} kcal</p>
              </li>
              <li className={s.item}>
                <p>Daily rate</p>
                <p>{summary.dailyCalories} kcal</p>
              </li>
              <li className={s.item}>
                <p>n% of normal</p>
                <p>{hasDailyMeals ? summary.percent : "0.00"} %</p>
              </li>
            </ul>
          )}
        </section>

        {/* ========= NOT RECOMMENDED FOODS ========= */}
        <section className={s.section}>
          <h2 className={s.title}>Foods you should not eat</h2>

          {!hasDietInfo && <p>Your diet will be displayed here.</p>}

          {hasDietInfo && (
            <ol className={s.productsList}>
              {notAllowed.map((el, index) => (
                <li key={`${el.title}-${index}`} className={s.productItem}>
                  {el.title}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
};

export default SideBar;
