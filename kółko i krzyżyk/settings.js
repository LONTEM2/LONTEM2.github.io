if(localStorage.getItem("Nick1")==null)
{
    let x = "Gracz1";
    localStorage.setItem("Nick1",x);
}
if(localStorage.getItem("Nick2")==null)
{
    let x = "Gracz2";
    localStorage.setItem("Nick2",x);
}
function ZapisNicku(nazwa) {
    let NickName = document.getElementById(nazwa);
    localStorage.setItem(nazwa,NickName.value);
}

function WczytywanieNicku()
{
    let Nick1 = document.getElementById("Nick1");
    Nick1.value = localStorage.getItem("Nick1");
    let Nick2 = document.getElementById("Nick2");
    Nick2.value = localStorage.getItem("Nick2");
    
}
function SprawdzWybor()
{
    let LIstaRozwijana = document.getElementById("Wybor");
    localStorage.setItem("TypGracza2",LIstaRozwijana.value);
    if(LIstaRozwijana.value=="Gracz 2")
    {
        let Nick2 = document.getElementById("Nick2");
        Nick2.disabled = false;
    }
    else
    {
        let Nick2 = document.getElementById("Nick2");
        Nick2.disabled = true;
    }
}

WczytywanieNicku();
SprawdzWybor();

