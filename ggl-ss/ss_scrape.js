=SUBSTITUTE("<iframe width='100%' height='450' scrolling='no' frameborder='no' src='https://w.sndcld.com/player/?url=https%3A//__URL__&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true'></iframe>
","__URL__",REGEXEXTRACT(IMPORTXML(A1,"/html/body/script[6]"),"api.sndcld.com\/tracks\/[0-9]{9}"))
