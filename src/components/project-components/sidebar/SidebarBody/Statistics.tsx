import React, { useEffect, useRef, useState } from "react";
import { selectUsername } from "state/reducers/authSlice";
import { useAppSelector } from "state/hooks";
import { Storage } from "aws-amplify";
import MyIcon from "assets/MyIcons";

interface StatisticsProps {
  projectId: any;
}

const Statistics = (props: StatisticsProps) => {
  const { projectId } = props;
  const username = useAppSelector(selectUsername);
  const [csvAvailable, setCsvAvailable] = useState(false);
  const [touchstoneAvailable, setTouchstoneAvailable] = useState(false);
  const [pdfAvailable, setPdfAvailable] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const checkAvailability = async (
    projectId: string,
    version: any,
    username: any
  ) => {
    try {
      const result: { [key: string]: any } = await Storage.list(
        `${username}/projects/${projectId}/${version}/results/`
      );
      const list = result.results || [];

      const csvPattern = /\.csv$/i; // Regular expression for .csv
      const sNpPattern = /\.s[1-9][0-9]*p$/; // Regular expression for .sNp
      const pdfPattern = /\.pdf$/i; // Regular expression for .pdf

      let csvExists = false;
      let touchstoneExists = false;
      let pdfExists = false;

      list.forEach((item: { key: string }) => {
        if (csvPattern.test(item.key)) {
          csvExists = true;
        }
        if (sNpPattern.test(item.key)) {
          touchstoneExists = true;
        }
        if (pdfPattern.test(item.key)) {
          pdfExists = true;
        }
      });

      setCsvAvailable(csvExists);
      setTouchstoneAvailable(touchstoneExists);
      setPdfAvailable(pdfExists);
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  useEffect(() => {
    checkAvailability(projectId, "v1", username);

    intervalRef.current = window.setInterval(() => {
      checkAvailability(projectId, "v1", username);
    }, 3000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [projectId, username]);

  function downloadBlob(blob: any, filename: any) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "download";
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener("click", clickHandler);
      }, 150);
    };
    a.addEventListener("click", clickHandler, false);
    a.click();
    return a;
  }

  const downloadCsv = async (
    projectId: string,
    version: any,
    username: any
  ) => {
    try {
      const result: { [key: string]: any } = await Storage.list(
        `${username}/projects/${projectId}/${version}/results/`
      );
      const list = result.results || [];
      const csvPattern = /\.csv$/i; // Regular expression for .csv
      const files = await Promise.all(
        list.map(async (item: { key: string }, index: number) => {
          if (csvPattern.test(item.key)) {
            const data = await Storage.get(item.key, {
              download: true,
              cacheControl: "no-cache",
            });
            const fileName = item.key.split("/").pop();
            downloadBlob(data.Body, fileName);
          }
        })
      );
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const downloadTouchstone = async (
    projectId: string,
    version: any,
    username: any
  ) => {
    try {
      const result: { [key: string]: any } = await Storage.list(
        `${username}/projects/${projectId}/${version}/results/`
      );
      const list = result.results || [];
      const sNpPattern = /\.s[1-9][0-9]*p$/; // Regular expression for .sNp
      const files = await Promise.all(
        list.map(async (item: { key: string }, index: number) => {
          if (sNpPattern.test(item.key)) {
            const data = await Storage.get(item.key, {
              download: true,
              cacheControl: "no-cache",
            });
            const fileName = item.key.split("/").pop();
            downloadBlob(data.Body, fileName);
            return;
          }
        })
      );
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const downloadPdf = async (
    projectId: string,
    version: any,
    username: any
  ) => {
    try {
      const result: { [key: string]: any } = await Storage.list(
        `${username}/projects/${projectId}/${version}/results/`
      );
      const list = result.results || [];
      const pdfPattern = /\.pdf$/i; // Regular expression for .pdf
      const files = await Promise.all(
        list.map(async (item: { key: string }, index: number) => {
          if (pdfPattern.test(item.key)) {
            const data = await Storage.get(item.key, {
              download: true,
              cacheControl: "no-cache",
            });
            const fileName = item.key.split("/").pop();
            downloadBlob(data.Body, fileName);
            return;
          }
        })
      );
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  return (
    <>
      <ul className="my-2 space-y-1 bg-[#F9FAFB] rounded-md pt-2 px-2 pb-1.5">
        <li className="bg-[#EAECF0] rounded-md">
          <a className="flex items-center px-2 py-0.5 text-sm font-normal text-[#101828] rounded-lg">
            <MyIcon name="statistics" />
            <span className="ml-3 font-bold text-base">Statistics</span>
            <div className="w-full flex justify-end">
              <div className="w-3 h-3 m-1 ml-2">
                {/* <MyIcon name="right-arrow" color="#667085" /> */}
              </div>
            </div>
          </a>
        </li>
        <li>
          <div className="bg-[#F9FAFB] rounded-md p-2 overflow-hidden">
            <div className=" space-y-4">
              <div>
                <div className=" text-base text-gray-700 font-semibold underline underline-offset-[3px] mb-1">
                  |S11| minima (MHz)
                </div>
                <h5 className="text-base text-gray-700 font-medium">
                  2405, 2422, 3011
                </h5>
              </div>

              <div>
                <div className=" text-base text-gray-700 font-semibold underline underline-offset-[3px] mb-1">
                  |S11| minimum
                </div>
                <h5 className="text-base text-gray-700 font-medium">-31 dB</h5>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div className="mt-5 space-y-3 bg-[#F9FAFB] rounded-md pt-2 px-2 pb-1.5">
        <div className="bg-[#EAECF0] rounded-md">
          <a className="flex items-center px-2 py-0.5 text-sm font-normal text-[#101828] rounded-lg">
            <MyIcon name="download" />
            <span className="ml-3 font-bold text-base">
              Download&nbsp;results
            </span>
            <div className="w-full flex justify-end">
              <div className="w-3 h-3 m-1 ml-2">
                {/* <MyIcon name="right-arrow" color="#667085" /> */}
              </div>
            </div>
          </a>
        </div>
        <div className="space-y-3">
          <button
            className={`flex items-center justify-center w-full h-10 rounded-lg shadow-sm ${
              csvAvailable
                ? "bg-greenLight-600 hover:bg-greenLight-700 active:bg-greenLight-800"
                : "bg-moss-200"
            }`}
            onClick={() => downloadCsv(projectId, "v1", username)}
            disabled={!csvAvailable}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
              >
                <path
                  d="M20.5 12.5V6.8C20.5 5.11984 20.5 4.27976 20.173 3.63803C19.8854 3.07354 19.4265 2.6146 18.862 2.32698C18.2202 2 17.3802 2 15.7 2H9.3C7.61984 2 6.77976 2 6.13803 2.32698C5.57354 2.6146 5.1146 3.07354 4.82698 3.63803C4.5 4.27976 4.5 5.11984 4.5 6.8V17.2C4.5 18.8802 4.5 19.7202 4.82698 20.362C5.1146 20.9265 5.57354 21.3854 6.13803 21.673C6.77976 22 7.6198 22 9.29986 22H13M15.5 19L18.5 22M18.5 22L21.5 19M18.5 22V16"
                  stroke="white"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.3321 12.07C7.99143 12.07 7.69277 12.007 7.4361 11.881C7.17943 11.7503 6.97877 11.5707 6.8341 11.342C6.6941 11.1087 6.6241 10.838 6.6241 10.53V8.36C6.6241 8.04733 6.6941 7.77667 6.8341 7.548C6.97877 7.31933 7.17943 7.142 7.4361 7.016C7.69277 6.88533 7.99143 6.82 8.3321 6.82C8.67744 6.82 8.9761 6.88533 9.2281 7.016C9.48477 7.142 9.6831 7.31933 9.8231 7.548C9.96777 7.77667 10.0401 8.04733 10.0401 8.36H8.9901C8.9901 8.15467 8.93177 7.99833 8.8151 7.891C8.7031 7.78367 8.5421 7.73 8.3321 7.73C8.1221 7.73 7.95877 7.78367 7.8421 7.891C7.7301 7.99833 7.6741 8.15467 7.6741 8.36V10.53C7.6741 10.7307 7.7301 10.887 7.8421 10.999C7.95877 11.1063 8.1221 11.16 8.3321 11.16C8.5421 11.16 8.7031 11.1063 8.8151 10.999C8.93177 10.887 8.9901 10.7307 8.9901 10.53H10.0401C10.0401 10.838 9.96777 11.1087 9.8231 11.342C9.6831 11.5707 9.48477 11.7503 9.2281 11.881C8.9761 12.007 8.67744 12.07 8.3321 12.07ZM12.5014 12.07C12.142 12.07 11.8294 12.0093 11.5634 11.888C11.2974 11.7667 11.092 11.5963 10.9474 11.377C10.8027 11.1577 10.7304 10.8987 10.7304 10.6H11.7804C11.7804 10.7727 11.8457 10.9103 11.9764 11.013C12.1117 11.111 12.2937 11.16 12.5224 11.16C12.7417 11.16 12.912 11.111 13.0334 11.013C13.1594 10.915 13.2224 10.7797 13.2224 10.607C13.2224 10.4577 13.1757 10.3293 13.0824 10.222C12.989 10.1147 12.8584 10.0423 12.6904 10.005L12.1724 9.886C11.7384 9.78333 11.4 9.59433 11.1574 9.319C10.9194 9.039 10.8004 8.69833 10.8004 8.297C10.8004 7.99833 10.868 7.73933 11.0034 7.52C11.1434 7.296 11.3394 7.12333 11.5914 7.002C11.8434 6.88067 12.142 6.82 12.4874 6.82C13.01 6.82 13.423 6.95067 13.7264 7.212C14.0344 7.46867 14.1884 7.81633 14.1884 8.255H13.1384C13.1384 8.09167 13.08 7.96333 12.9634 7.87C12.8514 7.77667 12.688 7.73 12.4734 7.73C12.2727 7.73 12.1187 7.77667 12.0114 7.87C11.904 7.95867 11.8504 8.087 11.8504 8.255C11.8504 8.40433 11.8924 8.53267 11.9764 8.64C12.065 8.74267 12.1887 8.81267 12.3474 8.85L12.8934 8.976C13.346 9.07867 13.689 9.26533 13.9224 9.536C14.1557 9.802 14.2724 10.1427 14.2724 10.558C14.2724 10.8567 14.1977 11.1203 14.0484 11.349C13.9037 11.5777 13.6984 11.755 13.4324 11.881C13.171 12.007 12.8607 12.07 12.5014 12.07ZM16.0406 12L14.7736 6.89H15.8586L16.5656 10.117C16.589 10.229 16.617 10.3713 16.6496 10.544C16.687 10.7167 16.715 10.8637 16.7336 10.985C16.7523 10.8637 16.7756 10.7167 16.8036 10.544C16.8316 10.3713 16.8573 10.2267 16.8806 10.11L17.5666 6.89H18.6236L17.3706 12H16.0406Z"
                  fill="white"
                />
              </svg>
            </span>
            <span className="ml-2 text-white text-sm font-semibold">
              Export CSV
            </span>
          </button>

          <button
            className={`flex items-center justify-center w-full h-10 rounded-lg shadow-sm ${
              touchstoneAvailable
                ? "bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800"
                : "bg-orangeDark-200"
            }`}
            onClick={() => downloadTouchstone(projectId, "v1", username)}
            disabled={!touchstoneAvailable}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
              >
                <path
                  d="M20.5 12.5V6.8C20.5 5.11984 20.5 4.27976 20.173 3.63803C19.8854 3.07354 19.4265 2.6146 18.862 2.32698C18.2202 2 17.3802 2 15.7 2H9.3C7.61984 2 6.77976 2 6.13803 2.32698C5.57354 2.6146 5.1146 3.07354 4.82698 3.63803C4.5 4.27976 4.5 5.11984 4.5 6.8V17.2C4.5 18.8802 4.5 19.7202 4.82698 20.362C5.1146 20.9265 5.57354 21.3854 6.13803 21.673C6.77976 22 7.6198 22 9.29986 22H13M15.5 19L18.5 22M18.5 22L21.5 19M18.5 22V16"
                  stroke="white"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.3041 12.07C7.94477 12.07 7.6321 12.0093 7.3661 11.888C7.1001 11.7667 6.89477 11.5963 6.7501 11.377C6.60543 11.1577 6.5331 10.8987 6.5331 10.6H7.5831C7.5831 10.7727 7.64843 10.9103 7.7791 11.013C7.91443 11.111 8.09643 11.16 8.3251 11.16C8.54444 11.16 8.71477 11.111 8.8361 11.013C8.9621 10.915 9.0251 10.7797 9.0251 10.607C9.0251 10.4577 8.97844 10.3293 8.8851 10.222C8.79177 10.1147 8.6611 10.0423 8.4931 10.005L7.9751 9.886C7.5411 9.78333 7.20277 9.59433 6.9601 9.319C6.7221 9.039 6.6031 8.69833 6.6031 8.297C6.6031 7.99833 6.67077 7.73933 6.8061 7.52C6.9461 7.296 7.1421 7.12333 7.3941 7.002C7.6461 6.88067 7.94477 6.82 8.2901 6.82C8.81277 6.82 9.22577 6.95067 9.5291 7.212C9.8371 7.46867 9.9911 7.81633 9.9911 8.255H8.9411C8.9411 8.09167 8.88277 7.96333 8.7661 7.87C8.6541 7.77667 8.49077 7.73 8.2761 7.73C8.07544 7.73 7.92144 7.77667 7.8141 7.87C7.70677 7.95867 7.6531 8.087 7.6531 8.255C7.6531 8.40433 7.6951 8.53267 7.7791 8.64C7.86777 8.74267 7.99144 8.81267 8.1501 8.85L8.6961 8.976C9.14877 9.07867 9.49177 9.26533 9.7251 9.536C9.95844 9.802 10.0751 10.1427 10.0751 10.558C10.0751 10.8567 10.0004 11.1203 9.8511 11.349C9.70644 11.5777 9.5011 11.755 9.2351 11.881C8.97377 12.007 8.66343 12.07 8.3041 12.07ZM10.8634 12V8.15H11.8784V8.885H12.1864L11.8784 9.13C11.8784 8.80333 11.9717 8.54667 12.1584 8.36C12.345 8.17333 12.597 8.08 12.9144 8.08C13.2877 8.08 13.5864 8.21067 13.8104 8.472C14.039 8.73333 14.1534 9.081 14.1534 9.515V12H13.1034V9.62C13.1034 9.41933 13.0497 9.26533 12.9424 9.158C12.8397 9.046 12.6927 8.99 12.5014 8.99C12.3147 8.99 12.17 9.046 12.0674 9.158C11.9647 9.26533 11.9134 9.41933 11.9134 9.62V12H10.8634ZM15.0606 12V6.89H16.8036C17.163 6.89 17.4756 6.95767 17.7416 7.093C18.0123 7.22833 18.22 7.41733 18.3646 7.66C18.514 7.90267 18.5886 8.18733 18.5886 8.514C18.5886 8.836 18.514 9.12067 18.3646 9.368C18.2153 9.61067 18.0076 9.79967 17.7416 9.935C17.4756 10.0703 17.163 10.138 16.8036 10.138H16.1106V12H15.0606ZM16.1106 9.193H16.8036C17.0276 9.193 17.205 9.13233 17.3356 9.011C17.471 8.885 17.5386 8.71933 17.5386 8.514C17.5386 8.30867 17.471 8.14533 17.3356 8.024C17.205 7.898 17.0276 7.835 16.8036 7.835H16.1106V9.193Z"
                  fill="white"
                />
              </svg>
            </span>
            <span className="ml-2 text-white text-sm font-semibold">
              Export Touchstone
            </span>
          </button>

          <button
            className={`flex items-center justify-center w-full h-10 rounded-lg shadow-sm
            ${
              pdfAvailable
                ? "bg-orangeDark-600 hover:bg-orangeDark-700 active:bg-orangeDark-800"
                : "bg-rose-300"
            }`}
            onClick={() => downloadPdf(projectId, "v1", username)}
            disabled={!pdfAvailable}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M20 12.5V6.8C20 5.11984 20 4.27976 19.673 3.63803C19.3854 3.07354 18.9265 2.6146 18.362 2.32698C17.7202 2 16.8802 2 15.2 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.1198 22 8.79986 22H12.5M15 19L18 22M18 22L21 19M18 22V16"
                  stroke="white"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.1661 12V6.89H7.9091C8.26844 6.89 8.5811 6.95767 8.8471 7.093C9.11777 7.22833 9.32544 7.41733 9.4701 7.66C9.61944 7.90267 9.6941 8.18733 9.6941 8.514C9.6941 8.836 9.61944 9.12067 9.4701 9.368C9.32077 9.61067 9.1131 9.79967 8.8471 9.935C8.5811 10.0703 8.26844 10.138 7.9091 10.138H7.2161V12H6.1661ZM7.2161 9.193H7.9091C8.1331 9.193 8.31043 9.13233 8.4411 9.011C8.57644 8.885 8.6441 8.71933 8.6441 8.514C8.6441 8.30867 8.57644 8.14533 8.4411 8.024C8.31043 7.898 8.1331 7.835 7.9091 7.835H7.2161V9.193ZM10.3424 12V6.89H12.0014C12.356 6.89 12.664 6.95767 12.9254 7.093C13.1914 7.22833 13.3967 7.41967 13.5414 7.667C13.6907 7.90967 13.7654 8.19667 13.7654 8.528V10.355C13.7654 10.6817 13.6907 10.9687 13.5414 11.216C13.3967 11.4633 13.1914 11.657 12.9254 11.797C12.664 11.9323 12.356 12 12.0014 12H10.3424ZM11.3924 11.02H12.0014C12.216 11.02 12.3887 10.9593 12.5194 10.838C12.65 10.7167 12.7154 10.5557 12.7154 10.355V8.528C12.7154 8.332 12.65 8.17333 12.5194 8.052C12.3887 7.93067 12.216 7.87 12.0014 7.87H11.3924V11.02ZM14.5886 12V6.89H17.8786V7.87H15.6246V9.004H17.6966V9.984H15.6386V12H14.5886Z"
                  fill="white"
                />
              </svg>
            </span>
            <span className="ml-2 text-white text-sm font-semibold">
              Export PDF report
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Statistics;
