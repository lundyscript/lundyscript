"use client"

import type React from "react"
import { ArrowDown, ArrowUp } from "lucide-react"
import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { HyperText } from "@/components/magicui/hyper-text"
import axios from "axios"
import Image from "next/image"

type CommandOutput = {
  id: number
  text: string | React.ReactNode
  isCommand?: boolean
}

interface WeatherObject {
  base: string;
  clouds: {all: number};
  cod: number;
  coord: {lon: number, lat: number};
  dt: number;
  id: number;
  main: {temp: number, feels_like: number, temp_min: number, temp_max: number, pressure: number,};
  name: string;
  sys: {country: string, sunrise: number, sunset: number};
  timezone: number;
  visibility: number;
  weather: {0: {description: string, icon: string, id: number, main: string}};
  wind: {speed: number, deg: number; gust: number}
}

export const Time = () => {
  const [date, setDate] = useState(new Date());
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(new Date());
    }, 1000)

    return () => clearInterval(intervalId);
  }, [])

  return (
    <p>The current date and time in Jember, Indonesia is: <HyperText as={"span"} animateOnHover={false} className="text-[#B3FC03]">{date.toLocaleString("ID", { timeZone: "Asia/Jakarta",  dateStyle:"full"})}</HyperText> pukul <span className="text-[#B3FC03]">{date.toLocaleString("ID", { timeZone: "Asia/Jakarta", timeStyle:"long"})}</span></p>
  );
}

export default function Terminal() {
  const [input, setInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [output, setOutput] = useState<CommandOutput[]>([
    {
      id: 0,
      text: "Welcome to lundyscript.site !",
      isCommand: false,
    },
    {
      id: 1,
      text: 'Type "help" to see available commands.',
      isCommand: false,
    },
  ])
  const inputRef = useRef<HTMLInputElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const outputEndRef = useRef<HTMLDivElement>(null)

  // Focus input when terminal is clicked
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
    const terminal = terminalRef.current
    terminal?.addEventListener("click", handleClick)
    return () => {
      terminal?.removeEventListener("click", handleClick)
    }
  }, [])

  // Auto-scroll to bottom when output changes
  useEffect(() => { 
    outputEndRef.current?.scrollIntoView(); 
  }, [output]);


  // Focus input on initial render
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Cursor blink effect
    useEffect(() => {
      const interval = setInterval(() => {
        if (cursorRef.current) {
          cursorRef.current.style.opacity = cursorRef.current.style.opacity === "0" ? "1" : "0"
        }
      }, 500)
      return () => clearInterval(interval)
    }, [])

  // Weather API
  const [weatherData, setWeatherData] = useState<WeatherObject>();
  const url = process.env.NEXT_PUBLIC_WEATHER_APP_API_URL+""+process.env.NEXT_PUBLIC_WEATHER_APP_API_KEY;
  useEffect(() => {
    axios.get(url).then(response => {
      if (response.status === 200) {
        setWeatherData(response.data);
      } else {
        console.log("Error: " + response.status);
      }
    });
  }, [url]);
  
  const handleCommand = (cmd: string) => {
    // Add command to history
    setCommandHistory((prev) => [...prev, cmd])
    setHistoryIndex(-1)

    // Process command
    const command = cmd.trim().toLowerCase()
    const commandParts = command.split(" ")
    const mainCommand = commandParts[0]

    let response: React.ReactNode

    switch (mainCommand) {
      case "help":
        response = (
          <div className="mt-1">
            <table>
            <tbody>
              <tr>
                <td colSpan={2}>Available commands:</td>
              </tr>
              <tr>
                <td><span className="text-[#B3FC03]"><HyperText as={"span"} animateOnHover={false}>about</HyperText></span></td>
                <td>Displays basic information about lundy.</td>
              </tr>
              <tr>
                <td><span className="text-[#B3FC03]"><HyperText as={"span"} animateOnHover={false}>clear</HyperText></span></td>
                <td>Clear the terminal screen.</td>
              </tr>
              <tr>
                <td><span className="text-[#B3FC03]"><HyperText as={"span"} animateOnHover={false}>contact</HyperText></span></td>
                <td>Displays contact information for lundy.</td>
              </tr>
              <tr>
                <td><span className="text-[#B3FC03]"><HyperText as={"span"} animateOnHover={false}>datetime</HyperText></span></td>
                <td>Displays the current date and time in the lundy&apos;s timezone.</td>
              </tr>
              <tr>
                <td><span className="text-[#B3FC03]"><HyperText as={"span"} animateOnHover={false}>experience</HyperText></span>&nbsp;&nbsp;&nbsp;</td>
                <td>Displays information about lundy&apos;s experience.</td>
              </tr>
              <tr>
                <td><span className="text-[#B3FC03]"><HyperText as={"span"} animateOnHover={false}>help</HyperText></span></td>
                <td>Provides help information for lundyscript terminal commands.</td>
              </tr>
              <tr>
                <td><span className="text-[#B3FC03]"><HyperText as={"span"} animateOnHover={false}>projects</HyperText></span></td>
                <td>Displays information about what projects lundy has done in the past.</td>
              </tr>
              <tr>
                <td><span className="text-[#B3FC03]"><HyperText as={"span"} animateOnHover={false}>skills</HyperText></span></td>
                <td>Displays information about lundy&apos;s skills as a remote software developer.</td>
              </tr>
              <tr>
                <td><span className="text-[#B3FC03]"><HyperText as={"span"} animateOnHover={false}>weather</HyperText></span></td>
                <td>Displays the current weather in the city where lundy lives.</td>
              </tr>
            </tbody>
          </table>
          <br />
          </div>
        )
        break

      case "about":
        response = (
          <div>
            <p>Hello World!</p>
            <p>I&apos;m Lundy. A remote software developer doing web dev things based in Jember, Indonesia.</p>
            <p>Quite fond of puzzles and can say that problem solving is a passion of mine. I have a strong eye for details and design and am always keen on learning new things. Here you will find a selection of my latest works and collaborations, ask for freelance work, or just send me an invitation to grab a coffee together, virtually or not.</p>
            <p><a href="https://drive.google.com/file/d/14vEvMNTT2Ql3M8GR0hwgGQjV0GP116v_/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-[#B3FC03] underline underline-offset-4"><HyperText as={"span"} animateOnHover={false}>DOWNLOAD MY RESUME &#x1F865;</HyperText></a></p>
            <br/>
          </div>
        )
        break

      case "clear":
          output.length = 2
          return

      case "contact":
          response = (
            <div>
              <p>Have a project in mind? if you want to chat about a project, contact me on :</p>
              <table>
                <tbody>
                  <tr>
                    <td><HyperText as={"span"} className="text-green-500" animateOnHover={false}>Whatsapp</HyperText></td>
                    <td><a href="https://wa.me/6282245057092" target="_blank" rel="noopener noreferrer">+6282245057092</a></td>
                  </tr>
                  <tr>
                    <td><HyperText as={"span"} className="text-red-500" animateOnHover={false}>Email</HyperText></td>
                    <td><a href="mailto:lundyscript@gmail.com" target="_blank" rel="noopener noreferrer">lundyscript@gmail.com.</a></td>
                  </tr>
                  <tr>
                    <td><HyperText as={"span"} className="text-gray-400" animateOnHover={false}>Github</HyperText></td>
                    <td><a href="https://github.com/lundyscript" target="_blank" rel="noopener noreferrer">@lundyscript</a></td>
                  </tr>
                  <tr>
                    <td><HyperText as={"span"} className="text-blue-500" animateOnHover={false}>X&nbsp;&nbsp;&nbsp;&nbsp;</HyperText></td>
                    <td><a href="https://x.com/lundyscript" target="_blank" rel="noopener noreferrer">@lundyscript</a></td>
                  </tr>
                  <tr>
                    <td><HyperText as={"span"} className="text-purple-300" animateOnHover={false}>Instagram&nbsp;&nbsp;&nbsp;&nbsp;</HyperText></td>
                    <td><a href="https://instagram.com/lundy.al" target="_blank" rel="noopener noreferrer">@lundy.al</a></td>
                  </tr>
                </tbody>
              </table>
              <br/>
            </div>
          )
          break
      
      case "datetime":
        response = (
          <div>
            <Time/>
            <br/>
          </div>
        )
        break

      case "experience":
        response = (
          <div>
            <span className="text-[#B3FC03]"><HyperText as={"span"} animateOnHover={false}>EDUCATION</HyperText></span> :<br />
            <ul>
              <li>
                Digital Talent Scholarship | Data Analytics
                <dl>Microsoft Indonesia dan Kementerian Komunikasi dan Informatika Republik Indonesia | 2019</dl>
                <br />
              </li>
              <li>
                Sertifikasi Kompetensi Bidang Informatika | Junior Programmer
                <dl>Lembaga Sertifikasi Profesi Teknologi Informasi dan Telekomunikasi Indonesia | 2017 - 2018</dl>
                <br />
              </li>
              <li>
                Sarjana Ilmu Komputer | Teknik Informatika
                <dl>Universitas Muhammadiyah Jember | 2012 - 2017</dl>
              </li>
            </ul>
            <br />
            <span className="text-[#B3FC03]"><HyperText as={"span"} animateOnHover={false}>WORK</HyperText></span> :<br />
            <ul>
              <li>
                Pengelola Pangkalan Data Pendidikan Tinggi (PDDikti)
                <dl>Universitas Muhammadiyah Jember | 2020 - Now</dl>
                <br />
              </li>
              <li>
                Remote Software Developer
                <dl>Jember | 2017 - Now</dl>
              </li>
            </ul>
            <br />
          </div>
        )
        break

      case "projects":
        response = (
          <div>
            <ul>
              <li>
                <a href="https://simrpl.unmuhjember.ac.id/" target="_blank" rel="noopener noreferrer" className="text-[#B3FC03] underline underline-offset-4"><HyperText as={"span"} animateOnHover={false}>SIMRPL v2.0 🡥</HyperText></a>
                <p>Sistem Informasi Manajemen Rekognisi Pembelajaran Lampau Universitas Muhammadiyah Jember</p>
                <dl>2024 | Build with Laravel, TailwindCSS, and MySQL</dl>
                <br />
              </li>
              <li>
                <a href="https://www.sdhamkajember.sch.id/" target="_blank" rel="noopener noreferrer" className="text-[#B3FC03] underline underline-offset-4"><HyperText as={"span"} animateOnHover={false}>SDHAMKA v1.0 🡥</HyperText></a>
                <p>Landing Page, Ensiklopedia dan PPBD Online SD Muhammadiyah Kaliwates Jember</p>
                <dl>2024 | Build with NextJS, TailwindCSS, shadcn/ui and PostgreSQL</dl>
                <br />
              </li>
              <li>
                <a href="https://moyamu-v2.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[#B3FC03] underline underline-offset-4"><HyperText as={"span"} animateOnHover={false}>MOYAMU v2.0 🡥</HyperText></a>
                <p>Aplikasi Point of Sales Moyamu Jember</p>
                <dl>2024 | Build with NextJS, TailwindCSS, shadcn/ui and PostgreSQL</dl>
                <br />
              </li>
              <li>
                <a href="https://sahabatmbk.com/" target="_blank" rel="noopener noreferrer" className="text-[#B3FC03] underline underline-offset-4"><HyperText as={"span"} animateOnHover={false}>SAHABATAMK v2.0 🡥</HyperText></a>
                <p>Media belajar untuk Mahasiswa Berkebutuhan Khusus (MBK).</p>
                <dl>2023 | Build with CodeIgniter and MySQL</dl>
                <br />
              </li>
              <li>
                <a href="https://syaharrasa.com/" target="_blank" rel="noopener noreferrer" className="text-[#B3FC03] underline underline-offset-4"><HyperText as={"span"} animateOnHover={false}>SYAHARRASA v1.0 🡥</HyperText></a>
                <p>Homemade Cookies Landing Page and Admin Dashboard</p>
                <dl>2023 | Build with Laravel, TailwindCSS, daisyUI and MySQL</dl>
                <br />
              </li>
              <li>
                <a href="https://github.com/lundyscript/lundyscript.github.io.git" target="_blank" rel="noopener noreferrer" className="text-[#B3FC03] underline underline-offset-4"><HyperText as={"span"} animateOnHover={false}>LUNDYSCRIPT v3.3 🡥</HyperText></a>
                <p>My personal portfolio.</p>
                <dl>2023 | Build with React, Vite and TailwindCSS</dl>
                <br />
              </li>
              <li>
                <a href="https://kbtkmambaululum.sch.id/" target="_blank" rel="noopener noreferrer" className="text-[#B3FC03] underline underline-offset-4"><HyperText as={"span"} animateOnHover={false}>SIMU v1.0 🡥</HyperText></a>
                <p>Sistem Informasi dan Website Sekolah TK Mambaul Ulum Jember</p>
                <dl>2023 | Build with Laravel, TailwindCSS and MySQL</dl>
                <br />
              </li>
              <li>
                <a href="https://github.com/lundyscript/sam-v1.0.0.git" target="_blank" rel="noopener noreferrer" className="text-[#B3FC03] underline underline-offset-4"><HyperText as={"span"} animateOnHover={false}>SAM v1.0 🡥</HyperText></a>
                <p>Sistem Administrasi Moyamu Jember</p>
                <dl>2018 | Build with PHP Native, Bootstrap 4 and MySQL</dl>
                <br />
              </li>
              <li>
                <a href="http://repository.unmuhjember.ac.id/517/1/ARTIKEL.pdf" target="_blank" rel="noopener noreferrer" className="text-[#B3FC03] underline underline-offset-4"><HyperText as={"span"} animateOnHover={false}>JSTLVQ v1.0 🡥</HyperText></a>
                <p>Aplikasi Identifikasi Nomor Polisi Kendaraan Roda Dua Menggunakan Jaringan Syaraf Tiruan Learning Vector Quantization</p>
                <dl>2017 | Build with Matlab</dl>
              </li>
            </ul>
            <br />
          </div>
        )
        break
      
      case "skills":
        response = (
          <div>
            <p className="text-[#B3FC03]"><HyperText as={"span"} animateOnHover={false}>Languages</HyperText>:</p>
            <p>HTML, CSS, JavaScript, PHP</p>
            <br />
            <p className="text-[#B3FC03]"><HyperText as={"span"} animateOnHover={false}>Libraries/Frameworks</HyperText>:</p>
            <p>Laravel, CodeIgniter, NextJS, NodeJS, TailwindCSS, Bootstrap, React, Vite</p>
            <br />
            <p className="text-[#B3FC03]"><HyperText as={"span"} animateOnHover={false}>Other</HyperText>:</p>
            <p>PostgreSQL, MySql, Git, Github, Photoshop, CorelDraw</p>
            <br />
          </div>
        )
        break

      case "weather":
        if (!weatherData) {
          response = (
            <div>
              <div>{url}</div>
              <p>Loading...</p>
              <br/>
            </div>
          )
        } else {
          const temp = weatherData.main.temp+"°C."
          const feels_like = weatherData.main.feels_like+"°C."
          const description = weatherData.weather[0].description+"."
          const icon = "https://openweathermap.org/img/wn/"+weatherData.weather[0].icon+".png"
          response = (
            <div>
              <Image src={icon} width={50} height={50} alt="Weather Icon"/>
              <p>The current temperature in Jember, Indonesia is: <HyperText as={"span"} animateOnHover={false} className="text-[#B3FC03]">{temp}</HyperText></p>
              <p>Feels like <HyperText as={"span"} animateOnHover={false} className="text-[#B3FC03]">{feels_like}</HyperText> <span className="capitalize">{description}</span></p>
              <br/>
            </div>
          )
        }
        break

      default:
        response = (
          <div>
            <p className="text-[#ff3c41]">{command} is not recognized as an internal or external command. Type &quot;help&quot; to see available commands.</p>
            <br/>
          </div>
        )
    }

    setOutput((prev) => [
      ...prev,
      {
        id: prev.length + 2,
        text: ``,
        isCommand: false,
      },
      {
        id: prev.length,
        text: `${cmd}`,
        isCommand: true,
      },
      {
        id: prev.length + 1,
        text: response,
      },
    ])
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (input.trim()) {
        handleCommand(input)
        setInput("")
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    }
  }

  return (
    <div
      className="bg-[#0C0D11] text-white font-mono p-4 min-h-screen flex flex-col text-[10pt] tracking-tighter"
      ref={terminalRef}
    >
      <div className="flex-1 overflow-auto whitespace-pre-wrap w-full sm:max-w-2xl md:max-w-2xl lg:max-w-2xl xl: max-w-2xl">
        {output.map((line, i) => (
          <div key={i} className={`${line.isCommand ? "text-white" : "text-gray-300"}`}>
            {line.isCommand ? (
              <div>
                <div className="text-[#92dfa5]">┌──(<span className="font-medium text-[#00BFFF]">guest㉿lundyscript</span>)-[<span className="text-white">~</span>]</div>
                <div className="flex">
                  <span className="text-[#92dfa5]">└─<span className="font-medium text-[#00BFFF]">$ </span></span>
                  <div>{line.text}</div>
                </div>
              </div>
            ) : (
              line.text
            )}
          </div>
        ))}
        <div className="text-[#92dfa5]">┌──(<span className="font-medium text-[#00BFFF]">guest㉿lundyscript</span>)-[<span className="text-white">~</span>]</div>
        <div className="flex items-center">
          <span className="text-[#92dfa5]">└─<span className="font-medium text-[#00BFFF]">$ </span></span>
            <span>{input}</span>
            <span ref={cursorRef} className="h-4 w-2 bg-white"></span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="opacity-0 absolute left-0 w-0 h-0"
              aria-label="Terminal input"
              autoFocus
            />
        </div>
      </div>
      <div ref={outputEndRef} />
      <div className="flex justify-end mt-2 text-xs text-gray-500">
        <div className="flex items-center mr-4">
          <ArrowUp className="w-3 h-3 mr-1" /> Previous command
        </div>
        <div className="flex items-center">
          <ArrowDown className="w-3 h-3 mr-1" /> Next command
        </div>
      </div>

    </div>
  )
}
