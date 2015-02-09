$(function(){

    //обработчик на клик по ссылкам: вход и регистрация
    $('#reg').on('click','a',function (e){
        if($(e.target).html() === 'вход'){
            $('#form_login').show();
            $('#bg1_form').show();
        }else if($(e.target).html() === 'регистрация'){
            $('#form_reg').show();
            $('#bg1_form').show();
        }
    });

    //обработчик на клик по ссылке забыли пароль
    $('#foggot').on('click',function (e){
            $('#form_login').hide();
        var ff = $('#form_foggot');
            var ml = ff.css('marginLeft');
            ff.css({'marginLeft' : parseInt(ml) - 100});
            ff.show().animate({'marginLeft': parseInt(ml)},150,'easeOutCirc');
//        show();

    });

    //обработчик на клик по кнопке обратный звонок
    $('button.btn').on('click',function (e){
            $('#form_cb').show();
            $('#bg6_form').show();
    });

    //обработчик на закрытие форм
    $('.close').on('click',function (e){
        $(this).closest('form').hide().end().closest('.block').find('div:first').hide();
    });

    //обработчик на клик по кнопкам внизу страниц для перемещения между страницами
    $('a.next').on('click',function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        var offset = $(href).offset();//console.log('offset:',offset);
        $('body,html').animate({'scrollTop': offset.top},1000);
    });

    //обработчик на клик по иконкам первой страницы для перемещения между страницами
    $('#table_icons a').on('click',function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        var offset = $(href).offset();//console.log('offset:',offset);
        $('body,html').animate({'scrollTop': offset.top},1000);
    });

    //обработчик на клик по меню справа для перемещения между страницами
    $('.pages').on('click','>div',function(e){
        var href = $(this).attr('class');
        var ar = href.split(' ');
        var tg = '#bg' + ar[0].substr(-1);//console.log('tg:',tg,$(tg));
        var offset = $(tg).offset();//console.log('offset:',offset);
        $('body,html').animate({'scrollTop': offset.top},1000);
    });

    //валидация форм
    $('.input_submit').on('click',function(e){//console.log(e);
        var proof;
        var form = $(this).closest('form');
        var error = form.find('.error');
        var name = form.find('input[name="name"]').val();
        var email = form.find('input[name="email"]').val();
        var tel = form.find('input[name="tel"]').val();
        var pass = form.find('input[name="pass"]').val();
        var pass_again = form.find('input[name="pass_again"]').val();
        var regExp_email = /^[\.\w]+@[\w]+.[\w]{2,3}$/i;
        var regExp_tel = /^\(?[-_\d]+\)?[-_\d]+$/i;
        var isEmail = (email) ? email.match(regExp_email) : null;//console.log('isEmail:',isEmail);
        var isTel = (tel) ? tel.match(regExp_tel) : null;//console.log('isTel:',isTel);
        pass = $.trim(pass);//console.log('pass:',pass);
        pass_again = $.trim(pass_again);//console.log('pass_again:',pass_again);
        name = $.trim(name);//console.log('name:',name);
        var passEquils = pass === pass_again;

        if(form.attr('id') === 'form_login'){//console.log(1);
            proof = isEmail && pass;
        }else if(form.attr('id') === 'form_reg'){//console.log(2);
            proof = name && isEmail && isTel && pass && pass_again && passEquils;
        }else if(form.attr('id') === 'form_cb'){//console.log(2);
            proof = isTel;
        }else if(form.attr('id') === 'form_foggot'){//console.log(2);
            proof = isEmail;
        }
        if(proof){
            error.hide();
            $.ajax({
                url: '/',
                type: 'POST',
                dataType: 'json',
                data: form.serialize()
            })
            .done(function(data){
                if(data.ok){
                    form.find('.close').click();
                    error.html('');
                    var ph = form.find('input[placeholder]');
                    $.each(ph,function(){
                        $(this).val('');
                    })
                    console.log('data:',data);
                }
            })
            .fail(function(){
                error.html('ошибка связи с сервером').show();
                animateMove();
            });
        }else{
            error.html('пустые поля или ошибка ввода данных').show();
            animateMove();

        }
        function animateMove(){
            var ml = form.css('marginLeft');console.log('ml:',ml,form);
            form.animate({'marginLeft': (parseInt(ml) - 10)},50,'easeInOutElastic')
                .animate({'marginLeft': (parseInt(ml) + 5)},50,'easeInOutElastic')
                .animate({'marginLeft': (parseInt(ml) - 3)},50,'easeInOutElastic')
                .animate({'marginLeft': parseInt(ml)},50,'easeInOutElastic',function(){console.log(1)});
        }
    });

/*
    //обработчик на остановку скролла
    //определение видимости a.next
    (function(){
        var arrA = $('a.next');
        var ar = [];
        var HEIGHT;
        var scroll;
        var min,max,max1_2;
        var st;
        $(window).on('scroll',cb);

        function cb(){
                if(st){
                    clearTimeout(st);
                    ar.length = 0;
                }
                st = setTimeout(function(){
                    getCoord();
                },1000);
        }

    function getCoord(){

        HEIGHT = innerHeight;
        scroll = $('body').scrollTop();
        min = scroll;
        max = scroll + HEIGHT;
        max1_2 = scroll + HEIGHT/2;

        for(var i = 0,l = arrA.length;i < l; i++){
            var el = arrA[i];
            ar.push(isVisible(el));
            if(isVisible(el)){
                startAnimate(el,upOrDown(el));
                break;
            }
        }
    }
    function isVisible(el){
        var top = $(el).offset().top;
        if(top > min && top < max){
            return true;
        }
        return false;
    }
    function upOrDown(el){
        var top = $(el).offset().top;
        if(top > min && top < max1_2){
            return 'up';
        }else if(top >= max1_2 && top < max){
            return 'down';
        }

    }
    function startAnimate(el,direction){
        var href = $(el).attr('href');
        if(direction === 'up'){
            href = '#bg' + (href.substr(-1) - 1);
        }
        var offset = $(href).offset();
        $(window).off('scroll',cb);
        $('body').animate({'scrollTop': offset.top},1000,function(){
            console.log(100);
//            $(window).on('scroll',cb);
        });
    }
    })();
*/
});