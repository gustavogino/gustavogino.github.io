$(document).ready(function () {
  "use strict";

  // UTILITY
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // END UTILITY

  // COMMANDS

function help() {
    terminal.append("\n");
    terminal.append("Consulte as funções disponíveis\n");
    terminal.append("\n");
    terminal.append("help          - Mostra os comandos disponíveis e suas funções\n")
    terminal.append("clear         - Limpa mensagens anteriores do console\n")
    terminal.append("dev           - Exibe as informações do desenvolvedor\n")    
    terminal.append("fortune       - Exibe uma mensagem aleatória\n")
    terminal.append("echo          - Permite que você escreva no console como sistema\n")
    terminal.append("browserinfo   - Exibe informações sobre seu navegador\n")
    terminal.append("youtube       - Abre uma nova guia com o youtube\n")
    terminal.append("update        - Atualiza a esta página web\n")
    terminal.append("datatime      - Exibe informações sobre o dia e hora\n")
    terminal.append("\n");
  }

  function clear() {
    terminal.text("");
  }

  function dev() {
    terminal.append("\n");
    terminal.append("Nome:    Gustavo Gino Scotton" + "\n");
    terminal.append("Email:   gustavo.gino@outlook.com" + "\n");
    terminal.append("Idade:   " + getAge("1997-03-29") + " anos\n");
    terminal.append("\n");
  }

  function fortune() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://cdn.rawgit.com/bmc/fortunes/master/fortunes', false);
    xhr.send(null);

    if (xhr.status === 200) {
      var fortunes = xhr.responseText.split("%");
      var fortune = fortunes[getRandomInt(0, fortunes.length)].trim();
      terminal.append("\n");
      terminal.append(fortune + "\n");
      terminal.append("\n");
    }
  }

  function echo(args) {
    var str = args.join(" ");
    terminal.append("\n");
    terminal.append(str + "\n");
    terminal.append("\n");
  }

  function browserinfo() {
    terminal.append("\n");
    terminal.append("Código: " + navigator.appCodeName + "\n");
    terminal.append("Navegador: " + navigator.appName + "\n");
    terminal.append("Versão: " + navigator.appVersion + "\n");
    terminal.append("Cookies: " + navigator.cookieEnabled + "\n");
    terminal.append("Loalização: " + navigator.geolocation + "\n");
    terminal.append("Lingua: " + navigator.language + "\n");
    terminal.append("Online: " + navigator.onLine + "\n");
    terminal.append("Plataforma: " + navigator.platform + "\n");
    terminal.append("Produto: " + navigator.product + "\n");
    terminal.append("UserAgent: " + navigator.userAgent + "\n");
    terminal.append("\n");
  }

  function youtube() {
    var win = window.open("https://www.youtube.com/", '_blank');
    win.focus();
  }

  function update(){
    location.reload();
    terminal.append("\n");
    terminal.append("Atualizando página...\n");
    terminal.append("\n");
  }

  function datatime(){
    var data = new Date();
    var dias = new Array('Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado');
    var meses = new Array('Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro');   
    var dia     = data.getDate();           // 1-31
    var dia_sem = data.getDay();            // 0-6 (zero=domingo)
    var mes     = data.getMonth();          // 0-11 (zero=janeiro)
    var ano4    = data.getFullYear();       // 4 dígitos
    var hora    = data.getHours();          // 0-23
    var min     = data.getMinutes();        // 0-59
    var seg     = data.getSeconds();        // 0-59
    var tz      = data.getTimezoneOffset(); // em minutos

    terminal.append("\n");
    terminal.append("Hoje é " + dias[dia_sem] + ", Dia " + dia + " de " + meses[mes] + " de " + ano4 + " às " + hora + ':' + min + "\n");
    terminal.append("\n");
  }

  // END COMMANDS

  var title = $(".title");
  var terminal = $(".terminal");
  var prompt = "➜";
  var path = "~";

  var commandHistory = [];
  var historyIndex = 0;

  var command = "";
  var commands = [{
      "name": "clear",
      "function": clear
    },
    {
      "name": "dev",
      "function": dev
    },
    {
      "name": "help",
      "function": help
    },
    {
      "name": "fortune",
      "function": fortune
    },
    {
      "name": "browserinfo",
      "function": browserinfo
    },
    {
      "name": "echo",
      "function": echo
    },
    {
      "name": "youtube",
      "function": youtube
    },
    {
      "name": "update",
      "function": update
    },
    {
      "name": "datatime",
      "function": datatime
    }
  ];


  function processCommand() {
    var isValid = false;
    var args = command.split(" ");
    var cmd = args[0];
    args.shift();

    for (var i = 0; i < commands.length; i++) {
      if (window.CP.shouldStopExecution(0)) break;
      if (cmd === commands[i].name) {
        commands[i].function(args);
        isValid = true;
        break;
      }
    }

    window.CP.exitedLoop(0);
    if (!isValid) {
      terminal.append("admin: command not found: " + command + "\n");
    }

    commandHistory.push(command);
    historyIndex = commandHistory.length;
    command = "";
  }

  function displayPrompt() {
    terminal.append("<span class=\"prompt\">" + prompt + "</span> ");
    terminal.append("<span class=\"path\">" + path + "</span> ");
  }

  // Delete n number of characters from the end of our output
  function erase(n) {
    command = command.slice(0, -n);
    terminal.html(terminal.html().slice(0, -n));
  }

  function clearCommand() {
    if (command.length > 0) {
      erase(command.length);
    }
  }

  function appendCommand(str) {
    terminal.append(str);
    command += str;
  }

  $(document).keydown(function (e) {
    e = e || window.event;
    var keyCode = typeof e.which === "number" ? e.which : e.keyCode;

    // BACKSPACE
    if (keyCode === 8 && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
      if (command !== "") {
        erase(1);
      }
    }

    // UP or DOWN
    if (keyCode === 38 || keyCode === 40) {
      // Move up or down the history
      if (keyCode === 38) {
        // UP
        historyIndex--;
        if (historyIndex < 0) {
          historyIndex++;
        }
      } else if (keyCode === 40) {
        // DOWN
        historyIndex++;
        if (historyIndex > commandHistory.length - 1) {
          historyIndex--;
        }
      }

      // Get command
      var cmd = commandHistory[historyIndex];
      if (cmd !== undefined) {
        clearCommand();
        appendCommand(cmd);
      }
    }
  });

  $(document).keypress(function (e) {
    // Make sure we get the right event
    e = e || window.event;
    var keyCode = typeof e.which === "number" ? e.which : e.keyCode;

    // Which key was pressed?
    switch (keyCode) {
      // ENTER
      case 13:
        {
          terminal.append("\n");

          processCommand();
          displayPrompt();
          break;
        }
      default:
        {
          appendCommand(String.fromCharCode(keyCode));
        }
    }

  });

  // Set the window title
  title.text("1. @gustavogino: ~ (admin)");

  // Get the date for our fake last-login
  var date = new Date().toString();
  date = date.substr(0, date.indexOf("GMT"));

  // Display last-login and promt
  terminal.append("Acesso: " + date + "em gustavogino.github.io\n");
  displayPrompt();
  var txt = "";

});

function toggleFullScreen(elem) {
 if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
     if (elem.requestFullScreen) {
         elem.requestFullScreen();
     } else if (elem.mozRequestFullScreen) {
         elem.mozRequestFullScreen();
     } else if (elem.webkitRequestFullScreen) {
         elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
     } else if (elem.msRequestFullscreen) {
         elem.msRequestFullscreen();
     }
 } else {
     if (document.cancelFullScreen) {
         document.cancelFullScreen();
     } else if (document.mozCancelFullScreen) {
         document.mozCancelFullScreen();
     } else if (document.webkitCancelFullScreen) {
         document.webkitCancelFullScreen();
     } else if (document.msExitFullscreen) {
         document.msExitFullscreen();
     }
 }
}