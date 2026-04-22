insert into public.charities (name, description, image_url, total_raised)
select *
from (
  values
    (
      'Save Water Initiative',
      'Providing clean drinking water access to rural communities across India through sustainable wells, filtration systems, and hygiene education.',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=900&h=700&fit=crop',
      45000
    ),
    (
      'Education for All',
      'Helping underprivileged children stay in school with learning kits, mentorship, digital classrooms, and scholarship support.',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&h=700&fit=crop',
      75000
    ),
    (
      'Healthcare Access',
      'Delivering medical camps, preventive screenings, essential medicines, and health education in underserved communities.',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&h=700&fit=crop',
      62000
    ),
    (
      'Meals for Hope',
      'Serving nutritious meals to children, elderly people, and low-income families through community kitchens and food distribution drives.',
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=900&h=700&fit=crop',
      38000
    ),
    (
      'Green Future Fund',
      'Supporting tree planting, waste reduction, and local climate resilience projects led by youth and neighborhood groups.',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&h=700&fit=crop',
      29000
    )
) as seed(name, description, image_url, total_raised)
where not exists (
  select 1
  from public.charities c
  where c.name = seed.name
);
