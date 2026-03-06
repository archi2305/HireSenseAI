import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

function ATSScore({ score }) {

  return (
    <div className="w-32 h-32">

      <CircularProgressbar
        value={score}
        text={`${score}%`}
        styles={buildStyles({
          textColor: "#16a34a",
          pathColor: "#16a34a",
          trailColor: "#e5e7eb",
          textSize: "20px"
        })}
      />

    </div>
  )
}

export default ATSScore