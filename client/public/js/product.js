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






