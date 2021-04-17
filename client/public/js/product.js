document.onkeydown = (e)=>{
    var keyCode = e ? (e.which ? e.which : e.keyCode) : e.keyCode;
    if(keyCode == 13)
    {
        console.log('Enter');
        if($('#search').val() !== '')
        {
            $('#serach_form').submit();

        }
    }
}


// const categories_load = document.getElementById('categories_load');
// const categories = document.getElementById('categories');
// categories_load.addEventListener('click',()=>{
//     categories.classList.toggle('cardheight')
// })


//get wishlist
const wishlist = $('.wishlist');

for(let i=0;i<wishlist.length;i++)
{
    $(wishlist[i]).click(function (e) { 
        e.preventDefault();
        let id = $(this).data('id');
        let email = $('#user_email').val();
        console.log('click',id);
        $.ajax({
            type: "POST",
            url: "/wishlist",
            data: {
                id : id,
                email : email
            },
            dataType: 'JSON',
            success: function (response) {
                console.log(response);
            }
        });
    });
}



document.addEventListener('DOMContentLoaded',getRatings)


function getRatings()
{
    console.log('get ratings')
    const totalStars = 5;
    const products = $('.stars_outer');
    // console.log(products);
    for(let i=0;i<products.length;i++)
    {
        let rating = parseFloat($(products[i]).data('rating'));
        let starPer = (rating/totalStars)*100;
        // console.log(starPer);
        let starPerRounded = `${Math.round(starPer/10)*10}%`;
        console.log(starPerRounded);
        $(products[i]).children('.stars_inner').css('width',starPerRounded);
        

    }
}
